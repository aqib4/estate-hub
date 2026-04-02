import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma= new PrismaClient();

 const listApplications = async(req:Request,res:Response):Promise<void> =>{
       try {
             const {userID,userType}= req.query;
             let whereClause= {};

             if(userID && userType){
                if(userType==="tenant"){
                    whereClause = {
                        tenantCognitoId: String(userID)
                    };
                }
                else if(userType==="manager"){
                    whereClause ={
                        property : {
                            mamagerCognitoId:String(userID)
                        }
                    }
                }
              }

             const applications= await prisma.application.findMany({
                where: whereClause,
                include:{
                    property: {
                        include:{
                            location: true,
                            manager: true
                        }
                    }
                }
             })

             function calculateNextPayments(startDate:Date):Date{
                  const Today=new Date();
                  const nextPaymentDate= new Date(startDate);

                  while(nextPaymentDate <= Today){
                    nextPaymentDate.setMonth(nextPaymentDate.getMonth()+1);
                  }
                    return nextPaymentDate;
             }
             
             const formatApplications= await Promise.all(
                app
             )


             
       } catch (err:any) {
        res.status(500).json({message:`Error Retrieving Lease: ${err.message}`});
       }
}



export  {  };