window.onload = function()
{
	
	function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
    return re.test(email);

}
	var usernameDiv = document.getElementById("usernameDiv")
		var emailDiv = document.getElementById("emailDiv")
		var passwordDiv = document.getElementById("passwordDiv")
		var confirmPasswordDiv = document.getElementById("confirmPasswordDiv")
		
		usernameDiv.style.visibility= "hidden";
		emailDiv.style.visibility= "hidden";
		passwordDiv.style.visibility= "hidden";
		confirmPasswordDiv.style.visibility= "hidden";
 var submitBtn = document.getElementById('submit');
	submitBtn.addEventListener('click', function(event)
	{
		var valid = true;
		
		
		
		
		
		
		
		var userNameElement = document.getElementById('userNameError');
		var emailElement = document.getElementById('emailError');
		var passwordElement = document.getElementById('passwordError');
		var confirmPasswordElement = document.getElementById('confrimPasswordError')
		
		userNameElement.innerHTML = " ";
		console.log(userNameElement)
		emailElement.innerHTML = " ";
		console.log(emailElement)
		passwordElement.innerHTML = " ";
		console.log(passwordElement)
		confirmPasswordElement.innerHTML = " ";
		
		var userNameField = document.getElementById("usernameField");
		var emailField = document.getElementById("emailField");
		var passwordField = document.getElementById("passwordField");
		var confirmPasswordField = document.getElementById("confirmPasswordField");
		
		var username = userNameField.value;
		var email = emailField.valule;
		console.log(email)
		var password = passwordField.value;
		var confirmPassword = confirmPasswordField.value;
		
		if(username == "")
		{
			usernameDiv.style.visibility= "visible";
			userNameElement.innerHTML = "A username is required";
			valid = false;
		}
	    if(email == " ")
		{
		  		  emailDiv.style.visibility= "visible";
				  emailElement.innerHTML = "a valid E-mail is required";
				  valid = false;
			  
		}
		 if(password == "")
		{
		 passwordDiv.style.visibility= "visible";
		 passwordElement.innerHTML = "A password is required";
		 valid = false;
		}
		
		if(confirmPassword != password)
		{
				confirmPasswordDiv.style.visibility= "visible";
				confirmPassword.innerHTML = "passwords do not match";
				valid = false;
		}
	   else if(confirmPassword == "")
		{
			confirmPasswordDiv.style.visibility= "visible";
			confirmPassword.innerHTML = "You must enter your password in again";
			valid = false;
		}
		
							  
		
		if(!valid)
		{
			event.preventDefault();
						//window.location.href = "./charts.html";

		}
		else if(valid)
		{
			window.location.href = "./charts.html";
		}
		
	})
}