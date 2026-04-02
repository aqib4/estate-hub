import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma= new PrismaClient();

const getLeases = async(req:Request,res:Response):Promise<void> =>{
       try {
           const leases= await prisma.lease.findMany({
            include:{
                tenant:true,
                property:true
            }
           })
           res.status(200).json(leases);
       } catch (err:any) {
        res.status(500).json({message:`Error Retrieving Lease: ${err.message}`});
       }
}

 const getLeasePayments= async (req:Request,res:Response):Promise<void> =>{

      try {
          const {id}= req.params;
          const paymentsLease=await prisma.payment.findMany({
            where: {leaseId:Number(id)},
          })
            if(!paymentsLease){
                res.status(404).json({message:"No payments found for this lease"});
                return;
            }
            res.status(200).json(paymentsLease);

      } catch (err:any) {
        res.status(500).json({message:`Error Retrieving Lease Payments: ${err.message}`});
      }
}

export  { getLeases, getLeasePayments };