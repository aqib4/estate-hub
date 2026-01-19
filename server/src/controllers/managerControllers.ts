import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const getManager = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    if (!cognitoId) {
      res.status(400).json({ message: 'cognitoId is required' });
      return;
    }
    const manager = await prisma.manager.findUnique({
      where: { cognitoId },
    });
    if (!manager) {
      res.status(404).json({ message: 'Manager not found' });
      return;
    }
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createManager = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId, name, email, phoneNumber } = req.body;
  try {
    const manager = await prisma.manager.create({
      data: {
        cognitoId,
        name,
        email,
        phoneNumber,
      },
    });
    res.status(201).json(manager);
  } catch (error: any) {
    res.status(500).json({ message: `Error Creating Manager: ${error.message}` });
  }
};

const updateManager = async (req: Request, res: Response): Promise<void> => {
    
  try{
    const {cognitoId}=req.params;

     if(!cognitoId){
         res.status(400).json({ message:"User ID is required"});
          return;
     }

     const {name, email, phoneNumber}=req.body;

     if(name=="" || email=="" || phoneNumber==""){
      res.status(400).json({ message:"Fields cannot be empty strings"}); 
      return;
     }

     if(!name && !email && !phoneNumber){
         res.status(400).json({message:"please provide at least one field to update"});
         return;
        }

     if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          res.status(400).json({message:"Invalid email format."});
          return;
      } 

     const existingManager=await prisma.manager.findUnique(
      {
        where: {cognitoId}
      }
     )

     if(!existingManager){
       res.status(404).json({message:"Manager Not Found"})
       return;
     }

     const updateData : any = {};
     if(name){
          updateData.name=name.trim();
     }
     if(email){
          updateData.email=email.trim().toLowerCase();
     }
     if(phoneNumber){
           updateData.phoneNumber=phoneNumber.trim();
     }
     
     const updatedManager= await prisma.manager.update({
           where:{cognitoId},
           data:updateData
    })

    res.status(200).json({
      message:"Manager updated Successfully",
      data:updatedManager
      });

  }
  catch(error:any){
      console.error("Error updating Manager:", error);
      res.status(500).json({message:`Unable to update Manager, please try again later. Error: ${error.message}`});
  }

}

export { getManager, createManager, updateManager };
