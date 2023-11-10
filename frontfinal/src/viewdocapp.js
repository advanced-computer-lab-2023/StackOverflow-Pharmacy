import { useState } from "react"
import doctorapt from "./dummydata"
export default function Viewdocapt(){


return(
<div style={{display:"block"}}>
{
    doctorapt.map(({patient,time,status})=>(
        <div style={{display:"flex"}}> 
        <div>{patient.name}</div> 
        <div>{time}</div>
        <div>{status}</div>
        
  </div>
    )
)
   


}
    
</div>
)








}