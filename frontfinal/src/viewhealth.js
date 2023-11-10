import { useState } from "react"
import health from "./dummydata2"
export default function Viewhealth(){


return(
<div style={{display:"block"}}>
{
    health.map(({name,price})=>(
        <div style={{display:"flex"}}> 
        <div>{name}</div> 
        
        <div>{price}</div>
        
  </div>
    )
)
   


}
    
</div>
)
}
