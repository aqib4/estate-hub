import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const listApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userID, userType } = req.query;
    let whereClause = {};

    if (userID && userType) {
      if (userType === "tenant") {
        whereClause = {
          tenantCognitoId: String(userID),
        };
      } else if (userType === "manager") {
        whereClause = {
          property: {
            managerCognitoId: String(userID),
          },
        };
      }
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        property: {
          include: {
            location: true,
            manager: true,
          },
        },
      },
    });

    function calculateNextPayments(startDate: Date): Date {
      const Today = new Date();
      const nextPaymentDate = new Date(startDate);

      while (nextPaymentDate <= Today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      return nextPaymentDate;
    }

    const formatApplications = await Promise.all(
      applications.map(async (app) => {
        const lease = await prisma.lease.findFirst({
          where: {
            tenant: {
              cognitoId: app.tenantCognitoId,
            },
            propertyId: app.propertyId,
            },
            orderBy: {
             startDate: "desc",
            },
        });

        return {
          ...app,
          property: {
            ...app.property,
            address: app.property.location.address,
          },
          manager: app.property.manager,
          lease: lease
            ? {
                ...lease,
                nextPaymentDate: calculateNextPayments(lease.startDate),
              }
            : null,
        };
      })
    );

    res.json(formatApplications);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: `Error Retrieving applications: ${err.message}` });
  }
};

const createApplication = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            applicationDate,
            status,
            tenantCognitoId,
            propertyId,
            name,
            email,
            phoneNumber,
            message   
        } = req.body;

        const property=await prisma.property.findUnique({
            where:{id:propertyId},
            select:{pricePerMonth:true,securityDeposit:true}
        })

        if(!property){
            res.status(404).json({message:"Property not found"});
            return;
        }
        
        const newApplication= await prisma.$transaction(async (prisma) => {
            //create lease first
            const least = await prisma.lease.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                    ),
                    rent: property.pricePerMonth,
                    deposit: property.securityDeposit,
                    property:{
                        connect: { id: propertyId }
                    },
                    tenant:{
                        connect: { cognitoId: tenantCognitoId }
                    }
                }
            });
             
            //then create application
            const application = await prisma.application.create({
                data: {
                    applicationDate: new Date(applicationDate),
                    status,
                    tenantCognitoId,
                    propertyId,
                    name,
                    email,
                    phoneNumber,
                    message,
                    property : {
                    connect :{ id: propertyId} 
                    },
                    tenant: {
                        connect: { cognitoId: tenantCognitoId }
                    },
                    lease: {
                        connect: { id: least.id }
                    }
                },
                include: {
                    property:true,
                    tenant:true,
                    lease:true
                }
            });
            return application;

     });

        res.status(201).json({
            message:"Application created successfully",
            application:newApplication
        })

    } catch (err: any) {
        res
        .status(500)
        .json({ message: `Error Creating application: ${err.message}` });
    }
};

const updateApplicationStatus= async (req: Request, res: Response): Promise<void> => {
    try{
        const {applicationId}=req.params;
        const {status}=req.body;
        
        const application= await prisma.application.findUnique({
          where: {id: Number(applicationId)},
          include: {
            property: true,
            tenant: true,
          }
        })

        if(!application){
            res.status(404).json({message:"Application not found"});
            return;
        }

        



     }
    catch(err:any){
        res
        .status(500)
        .json({ message: `Error Updating application status: ${err.message}` });
    }

export { listApplications, createApplication };
