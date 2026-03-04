import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { wktToGeoJSON } from '@terraformer/wkt';

const prisma = new PrismaClient();

const getTenant = async (req: Request, res: Response): Promise<void> => {

    try {
    const { cognitoId } = req.params;

    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId is required' });
      return;
    }
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId: cognitoId as string },
      include: { 
        favorites: true 
      },
    });

    if (tenant) {
      res.json(tenant);
    } else {
      res.status(400).json({ message: 'Tenant Not Found!' });
    }

  } catch (error: any) {
    res.status(500).json({ message: `Error Retrieving Tenant: ${error.message}` });
  }
};

const createTenant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId, name, email, phoneNumber } = req.body;
      //check for empty fields
      if(cognitoId==="" || name==="" || email==="" || phoneNumber==="") {
        res.status(400).json({message:"Please fill in all fields"});
        return;
      }
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ message: "Invalid email format." });
        return;
      }
      
      // Check if tenant with the same cognitoId already exists
      const existingTenant = await prisma.tenant.findUnique({
        where: { cognitoId },
      });
      if (existingTenant) {
        res.status(400).json({ message: "Tenant with this cognitoId already exists." });
        return;
      }
      
    const tenant = await prisma.tenant.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(tenant);
  } catch (error: any) {
    res.status(500).json({ message: `Error Creating Tenant: ${error.message}` });
  }
};

const updateTenant = async (req: Request, res: Response): Promise<void> => {
  try {

    const { cognitoId } = req.params;
    if (!cognitoId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    
    const { name, email, phoneNumber } = req.body;
    
    //check for empty fields
    if(name==="" || email==="" || phoneNumber==="") {
      res.status(400).json({message:"Please fill in all fields"});
      return;
    }
    //check if at least one field is provided
    if(!name || !email || !phoneNumber) {
      res.status(400).json({ message: "Please provide at least one field to update" });
      return;
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({message: "Invalid email format."});
    }
   
    const existingTenant = await prisma.tenant.findUnique({
      where:{ cognitoId}
    })
     
    if(!existingTenant){
      res.status(404).json({message:"Tenant not found."});
    }
    
    const updateData: any={};
    if(name) 
      updateData.name=name.trim();
    if(email)
      updateData.email=email.trim().toLowerCase();
    if(phoneNumber)
      updateData.phoneNumber=phoneNumber.trim();
    

    const updatedTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: updateData
     });

    res.json({
      message: "Tenant Updated Successfully",
      updatedTenant,
     });

  } catch (error: any) {
    res.status(500).json({
      message: `Error Updating Tenant: ${error.message}`,
    });
  }
};

const getCurrentResidency= async (req:Request, res:Response): Promise<void> => {
  
  try{
      const{ cognitoId }= req.params;
      if(!cognitoId){
        res.status(400).json({message:"cognitoId is required"});
        return;
      }
      const properties= await prisma.property.findMany({
         where : { tenants: {some : {cognitoId}}},
          include: {
            location: true,
          }
      })

      const propertiesWithProperFormatesdLocation= await Promise.all(
         properties.map(async (property)=> {
           const coordinates: {coordinates:string} []= await prisma.$queryRaw` SELECT ST_asText(coordinates) as coordinates from "Location" where id=${property.location.id}`;
           const geoJSON:any = wktToGeoJSON(coordinates[0] ? coordinates[0].coordinates : "");
           const longitude= geoJSON.coordinates[0];
           const latitude= geoJSON.coordinates[1]; 

           return {
            ...property,
            location: {
              ...property.location,
              coordinates:{
                longitude,
                latitude
              }
            }
           }
         
          })
      )

      res.json(propertiesWithProperFormatesdLocation);

  }
  catch(err:any){
    res.status(500).json({message:`Error Retrieving Current Residency for tenant: ${err.message}`})
  }

}

const addFavouriteProperty= async (req:Request,res:Response): Promise<void> =>{
   
  try{
       const {cognitoId,propertyId}=req.params;
        if(!cognitoId || !propertyId){
          res.status(400).json({message:"cognitoId and propertyId are required"});
          return;
        }
        const tenant =await prisma.tenant.findUnique({
          where:{cognitoId},
          include:{favorites:true}
        })
        if(!tenant){
          res.status(404).json({message:"Tenant not found"});
          return;
        }
        const PropertyIdNum= Number(propertyId);
        const existingFavourites= tenant?.favorites || [];
        
        if(!existingFavourites.some(fav=> fav.id===PropertyIdNum)){
          const updatedTenant = await prisma.tenant.update({
            where:{cognitoId},
            data: {
              favorites:{
                connect: {id:PropertyIdNum}
              }
            }
          });
          res.json({
            message:"Property added to favourites successfully",
            updatedTenant
          });
        }else{
          res.status(400).json({message:"Property already in favourites"});
        }

  }catch(err:any){
    res.status(500).json({message:`Error Adding Favourite Property: ${err.message}`})
  }
}

const removeFavouriteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
      const { cognitoId, propertyId } = req.params;

      if (!cognitoId || !propertyId) {
          res.status(400).json({ message: "cognitoId and propertyId are required" });
          return;
      }

      const propertyIdNum = Number(propertyId);

      // Check tenant exists and property is favorited in one query
      const tenant = await prisma.tenant.findUnique({
          where: { cognitoId },
          select: {
              id: true,
              favorites: {
                  where: { id: propertyIdNum }
              }
          }
      });

      if (!tenant) {
          res.status(404).json({ message: "Tenant not found" });
          return;
      }

      if (tenant.favorites.length === 0) {
          res.status(400).json({ message: "Property not in favourites" });
          return;
      }

      // Remove from favorites
      await prisma.tenant.update({
          where: { cognitoId },
          data: {
              favorites: {
                  disconnect: { id: propertyIdNum }
              }
          }
      });

      res.json({
          message: "Property removed from favourites successfully"
      });

  } catch (err: any) {
      res.status(500).json({ 
          message: `Error removing favourite property: ${err.message}` 
      });
  }
};

export { getTenant, createTenant, updateTenant, getCurrentResidency,addFavouriteProperty,removeFavouriteProperty };
