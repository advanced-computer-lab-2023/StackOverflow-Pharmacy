import { useState } from "react"

export default function Login(){
const [form,setform]=useState({})

const handlechange=(e)=>{
  const  {name,value}=e.target;
  setform({...form,[name]:value})
}

const handleclick=()=>{
    console.log(form)
}
    return(
        <div class="formcontainer">
        <form class="login100-form validate-form" onsubmit="return false;">



           <div class="wrap-input100 validate-input" data-validate = "Hourly Rate is required">
						<input class="input100" onChange={handlechange} id="rate" type="text" name="name" placeholder="Name" required/>
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-lock" aria-hidden="true"></i>
						</span>
					</div>

                    <div class="wrap-input100 validate-input" data-validate = "Affiliation (hospital) is required">
						<input class="input100" id="Affiliation" type="text" name="password" onChange={handlechange} placeholder="Password" required/> 
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-lock" aria-hidden="true"></i>
						</span>
					</div>

            <button name ="Login" class="login100-form-btn" onClick={handleclick}>
                Login
                </button>        
      </form>
      </div>
    )
}