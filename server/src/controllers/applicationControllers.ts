import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma= new PrismaClient();

 const listApplications = async(req:Request,res:Response):Promise<void> =>{
       try {
             const {userID,userType}= req.query;
             console.log("UserID:", userID);
             let whereClause= {};

             if(userID && userType){
                if(userType==="tenant"){
                    whereClause = {tenantCognitoId: String(userID)};
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

             
       } catch (err:any) {
        res.status(500).json({message:`Error Retrieving Lease: ${err.message}`});
       }
}



export  {  };