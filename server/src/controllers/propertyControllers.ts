import { PrismaClient, Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import {wktToGeoJSON} from '@terraformer/wkt';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import { Location } from '@prisma/client';

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1" // Provide a default region
});



export const getAllProperties = async (req: Request, res: Response): Promise<void> =>{
       
       try {

        const {
            favoriteIds,
            priceMin,
            priceMax,
            beds,
            baths,
            propertyType,
            squareFeetMin,
            squareFeetMax,
            amenities,
            availbleFrom,
            latitude,
            longitude,
          }= req.query;
           console.log('Query Parameters:', req.query);
          let whereConditions: Prisma.Sql[] = [];

          if(favoriteIds){
            const favoriteIdsArrary = (favoriteIds as string).split(',').map(Number);
            whereConditions.push(Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArrary, ',')})`
            );
           }

          if(priceMin){
             whereConditions.push(
                Prisma.sql`p."pricePerMonth" >=${Number(priceMin)}`
             );
          }

          if(priceMax)
          {
            whereConditions.push(
                Prisma.sql`p."pricePerMonth"<={Number(priceMax)}`
            );
          }

          if(beds && beds !=='any'){
            whereConditions.push(
                Prisma.sql`p.beds >= ${Number(beds)}`
            );
          }

          if(baths && baths !=='any'){
            whereConditions.push(
                Prisma.sql`p.baths >= ${Number(baths)}`
            );
          }

          if(squareFeetMin){
            whereConditions.push(
                Prisma.sql`p."squareFeet" >= ${Number(squareFeetMin)}`
            );
          }

          if(squareFeetMax){
            whereConditions.push(
                Prisma.sql`p."squareFeet" <= ${Number(squareFeetMax)}`
            );
          }

          if(propertyType && propertyType !=='any'){
            whereConditions.push(
                Prisma.sql`p."propretyType"= ${propertyType}::"PropertyType"`
            )
          }
            
          if(amenities && amenities !=='any'){
            const amenitiesArray= (amenities as string).split(',');
            whereConditions.push(
                Prisma.sql`p.amenities @> ${amenitiesArray}`
            ); 
          }

          if(availbleFrom && availbleFrom !=='any'){
            const availbleFromDate= typeof availbleFrom === "string" ? availbleFrom :null;
            if(availbleFromDate){
              const date= new Date(availbleFromDate);
              if(!isNaN(date.getTime())){ 
                whereConditions.push(
                  Prisma.sql`EXISTS (
                      SELECT 1 FROM "Lease" l
                      WHERE l."propertyId" = p.id
                      AND l."startDate"<= ${date.toISOString()};
                  )`
              );
              }
            }
          }

          if (latitude && longitude) {
            const lat = parseFloat(latitude as string);
            const lon = parseFloat(longitude as string);
            const radiusInKm = 1000;
            const degrees = radiusInKm / 111;
            
            whereConditions.push(
              Prisma.sql`ST_DWithin(
                l.coordinates::geometry,
                ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326),
                ${degrees}
              )`
            );
          }


          const completeQuery = Prisma.sql`
          SELECT 
          p.*,
          json_build_object(
              'id', l.id,
              'address', l.address,
              'city', l.city,
              'state', l.state,
              'country', l.country,
              'postalCode', l."postalCode",
              'coordinates', json_build_object(
                  'longitude', ST_X(l.coordinates::geometry),
                  'latitude', ST_Y(l.coordinates::geometry)
              )
          ) as location
          FROM "Property" p
          JOIN "Location" l ON p."locationId" = l.id
          ${
              whereConditions.length > 0
              ? Prisma.sql`WHERE ${Prisma.join(whereConditions, " AND ")}`
              : Prisma.empty
          }`;

          const properties= await prisma.$queryRaw(completeQuery);
          res.json(properties);

        
       } catch (error:any) {
            res.status(500).json({message:`Internal Server Error: ${error.message}`});
       }

}

export const getProperty = async (req:Request,res:Response):Promise<void> =>{
       try {
            const {id}= req.params;
            const property= await prisma.property.findUnique({
                where: {
                     id: Number(id)
                },
                include: {
                     location: true
                },
            })

            if (!property) {
              res.status(404).json({ message: "Property not found" });
              return;
            }

       
               const coordinates: {coordinates: string } []= 
               await prisma.$queryRaw`SELECT ST_asText(coordinates) as coordinates from "Location" where id=${property.location.id}`
              
               const geoJSON: any = wktToGeoJSON(coordinates[0] ? coordinates[0].coordinates : "")
               const longitude= geoJSON.coordinates[0];
               const latitude= geoJSON.coordinates[1];
              
               const propertyWithCoordinates= {
                ...property,
                location: {
                ...property.location,
                coordinates:{
                  longitude,
                  latitude
                }
              }
              }

               res.json(propertyWithCoordinates);
              
       } catch (err:any) {
           res.status(500).json({message:`Error Retreiving property :${err.message}`})
       }
}

export const createProperty = async (req:Request,res:Response):Promise<void> =>{

       try{
           const files= req.files as Express.Multer.File[];
           const {
            address,
            city,
            state,
            country,
            postalCode,
            managerCognitoId,
            ...propertyData
           }=req.body;

          const photoUrls = await Promise.all(
            files.map(async (file)=>{
              const uploadParams = {
                Bucket: process.env.s3_Bucket_NAME!,
                Key: `properties/${Date.now()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
             };

             const uploadResults = await new Upload({
                client: s3Client,
                params: uploadParams,
             }).done();

                 return uploadResults.Location;
            }));
           
          const geoCodingUrl = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
            {
              street: address,
              city,
              country,
              postalcode: postalCode,
              format: 'json',
              limit: '1'
            }
          ).toString()}`;

          const geoCodingResponse = await axios.get(geoCodingUrl, {
            headers : {
              "User-Agent": "ReatEstateApp (justdummyappemail@gmail.com"
            }
          });

          const [longitude,latitude] =geoCodingResponse.data[0]?.lon && geoCodingResponse.data[0]?.lat
          ? [
            parseFloat(geoCodingResponse.data[0].lon),
            parseFloat(geoCodingResponse.data[0].lat)
          ]
          : 
          [0,0];

          const [location] = await prisma.$queryRaw <Location[]>`
             INSERT INTO "Location" (address, city, state, country, "postalCode", coordinates)
             VALUES (${address}, ${city}, ${state}, ${country}, ${postalCode}, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326))
             RETURNING id, address, city, state, country, "postalCode", ST_AsText(coordinates) as coordinates
          `;

           const newProperty= await prisma.property.create({
            data: { 
              ...propertyData,
              photoUrls,
              locationId: location?.id ,
              managerCognitoId,
              amenities:
              typeof propertyData.amenities === "string"
              ? propertyData.amenities.split(',')
              : [],
              highlights:
              typeof propertyData.highlights === "string"
              ? propertyData.highlights.split(',')
              : [], 
              isPetsAllowed: propertyData.isPetsAllowed === 'true',
              isParkingIncluded: propertyData.isParkingIncluded === 'true',
              pricePerMonth: parseFloat(propertyData.pricePerMonth),
              securityDeposit: parseFloat(propertyData.securityDeposit),
              applicationFee: parseFloat(propertyData.applicationFee),
              beds: parseInt(propertyData.beds),
              baths:parseFloat(propertyData.baths),
              squareFeet: parseInt(propertyData.squareFeet),
            },
            include:{
              location: true,
              manager: true
            }
           });
           console.log('New Property Created:', newProperty);
           res.status(201).json(newProperty);

       }catch(err:any){
            res.status(500).json({message:`Error creating property: ${err.message}`})
       }
}

