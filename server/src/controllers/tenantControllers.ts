import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getTenant = async (req: Request, res: Response): Promise<void> => {

    const { cognitoId } = req.params;
    try {

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
  const { cognitoId, name, email, phoneNumber } = req.body;
  try {
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


export { getTenant, createTenant, updateTenant };
