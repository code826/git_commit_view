import express from 'express';
import cors from'cors';
import 'dotenv/config';
import { ApplicationError } from './ApplicationError.js';
import { getInformationByCommitId, isValidSHA } from './utils.js';
const PORT = process.env.PORT || 8001;


const server = express();


server.use(express.urlencoded({extended:true}));// post req or get request post www-form-urlencoded
server.use(express.json());//when content type application/json
server.use(cors());


server.get("/test",(req,res)=>{
    return res.status(200).json({
        'message':'all good'
    })
})

server.get("/repositories/:owner/:repo/commits/:oid/all", async (req, res,next) => {
  const { owner, repo, oid } = req.params;

  if (!owner) {
    throw new ApplicationError("Invalid Input: owner is required",400);
  }
  if (!repo) {
    throw new ApplicationError("Invalid Input: repo is required",400);
  }
  if (!oid || !isValidSHA(oid)) {
    throw new ApplicationError("Invalid Input: oid must be a 40-character hexadecimal SHA",400);
  }

  try {
    let data = await getInformationByCommitId(owner,repo,oid);
    
    return res.status(200).json({
      success:true,
      data:data
    });

  } catch (error) {
    console.error("Error", error.message);
    next(error);
  }
});


server.get("/repositories/:owner/:repo/commits/:oid", async (req, res,next) => {
  const { owner, repo, oid } = req.params;

  if (!owner) {
    throw new ApplicationError("Invalid Input: owner is required",400);
  }
  if (!repo) {
    throw new ApplicationError("Invalid Input: repo is required",400);
  }
  if (!oid || !isValidSHA(oid)) {
    throw new ApplicationError("Invalid Input: oid must be a 40-character hexadecimal SHA",400);
  }

  try {
    let data = await getInformationByCommitId(owner,repo,oid,1);
    
    return res.status(200).json({
      success:true,
      data:data
    });

  } catch (error) {
    console.error("Error", error.message);
    next(error);   
  }
});

server.get("/repositories/:owner/:repo/commits/:oid/diff", async (req, res,next) => {
  const { owner, repo, oid } = req.params;

  if (!owner) {
    throw new ApplicationError("Invalid Input: owner is required",400);
  }
  if (!repo) {
    throw new ApplicationError("Invalid Input: repo is required",400);
  }
  if (!oid || !isValidSHA(oid)) {
    throw new ApplicationError("Invalid Input: oid must be a 40-character hexadecimal SHA",400);
  }

  try {
    let data = await getInformationByCommitId(owner,repo,oid,2);
    
    return res.status(200).json({
      success:true,
      data:data
    });

  } catch (error) {
    console.error("Error", error.message);
    next(error); 
  }
});

server.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Valid API"
  });
});

server.use((err, req, res, next) => {
  console.log('err',err);
  if (err instanceof ApplicationError) {
    return res.status(err.code).json({
      success: false,
      message: err.message,
    });
  }
  //server error
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


export async function startServer() {
    try {
      server.listen(PORT, (err) => {
        if (err) {
          console.log("error", err);
          throw new Error(err);
        }
        console.log("server started at port", PORT);
      });
    } catch (error) {
      console.log("error", error);
    }
  }
  