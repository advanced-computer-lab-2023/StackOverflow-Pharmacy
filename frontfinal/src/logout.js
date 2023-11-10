import { useState } from "react"

export default function Logout(){

const handleclick=()=>{
   
}
    return(
        <div class="formcontainer">
        <form class="login100-form validate-form" onsubmit="return false;">


            <button name ="Logout" class="login100-form-btn" onClick={handleclick}>
                Logout
                </button>        
      </form>
      </div>
    )
}