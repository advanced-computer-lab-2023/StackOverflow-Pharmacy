import { useState } from "react"
import viewdocrequest from "./dummydatareq"
export default function Viewdocs(){


return(
<div style={{display:"block"}}>
{
    viewdocrequest.map(({rate,name,affilation})=>(
        <div style={{display:"flex"}}> 
        <div>{name}</div> 
        <div>{rate}</div>
        <div>{affilation}</div>
        
        <button name ="Login" class="login100-form-btn" >
              reject
                </button>  

        <button name ="Login" class="login100-form-btn" >
          accept
                </button>  
                
  </div>
    )
)
   


}
    
</div>
)








}