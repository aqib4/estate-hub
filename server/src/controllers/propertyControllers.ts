import { PrismaClient, Prisma } from '@prisma/client';
import { Request, Response } from 'express';


const prisma = new PrismaClient();

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

          let whereConditions: Prisma.Sql[] = [];

          if(favoriteIds){
            const favoriteIdsArrary = (favoriteIds as string).split(',').map(Number);
            whereConditions.push(Prisma.sql`p.id IN (${Prisma.join(favoriteIdsArrary)})`
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
                Prisma.sql`p."propretyType"= ${propertyType}::"propertyType"`
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
            if(latitude && longitude){
                const lat= parseFloat(latitude as string););
                const lon= parseFloat(longitude as string);
                const radiusInKm=1000;
                const degrees= radiusInKm/111;
                whereConditions.push(
                    Prisma.sql`ST_DWiwithin(
                        l.coordinates::geomatry,
                        ST_SetSRID(ST_MakePoint(${lon},${lat},4326),
                        ${degrees}
                    )`
                );
            }


            const completeQuery=Prisma.sql`
            SELECT 
            p.*,
            json_build_object(
                'id', l.id,
                'address',l.address,
                'city',l.city,
                'state',l.state,
                'country',l.country,
                'postalCode',l."postalCode",
                'coordinates',json_build_object(
                    'longitude',ST_X(l."coordinates"::geomatry),
                    'latitude',ST_Y(l."coordinates"::geomatry),
                )
            )as location
            FROM 'property'
            JOIN 'location' l ON p."locationId" = l.id
            ${
                whereConditions.length > 0
                ? Prisma.sql`WHERE ${Prisma.join(whereConditions, "AND")}`
                : Prisma.empty
            }`;

        
       } catch (error:any) {
            res.status(500).json({message:`Internal Server Error: ${error.message}`});
       }



}