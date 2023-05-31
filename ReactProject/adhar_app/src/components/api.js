
module.exports = {

    getAdmin: async (id, password) => {
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("admin_id", id);
            urlencoded.append("password", password);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            const result = await fetch("http://localhost:3000/Gov_Adhar_auth/GetAdmin", requestOptions);
            return result.text();


        } catch (e) {
            console.log(e);
            return ("Something went wrong.");
        }


    },

    getAll: async () => {
       
        var urlencoded = new URLSearchParams();

        var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        let result = await fetch("http://localhost:3000/Gov_Adhar_auth/GetAll", requestOptions)
        result = await result.text();
        // console.log(result);
        return result;

    },



    addNew: async (aadhaar, name, mobile, address, image, email, dob, gender) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("Adhar_number", aadhaar);
        urlencoded.append("Name", name);
        urlencoded.append("Mobile_number", mobile);
        urlencoded.append("Date_of_birth", dob);
        urlencoded.append("Address", address);
        urlencoded.append("Gender", gender);
        urlencoded.append("Image", image);
        urlencoded.append("Email_id", email);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        let result = await fetch("http://localhost:3000/Gov_Adhar_auth/Add_New", requestOptions)
        result = await result.text();
        // console.log(result);
        return result;
    },
    deletePerson: async (adhar_number) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("Adhar_number", adhar_number);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        let result = await fetch("http://localhost:3000/Gov_Adhar_auth/DeleteUser", requestOptions)
        result = await result.text();
        // console.log(result);
        return result;
    },

    verifyToken: async() => {
        const token = localStorage.getItem("Adhar_authToken");
        var myHeaders = new Headers();
        myHeaders.append("token", token)
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let result = await fetch("http://localhost:3000/Gov_Adhar_auth/verifyToken", requestOptions)
        result = await result.text();
        // console.log(result);
        return result;
    }
}