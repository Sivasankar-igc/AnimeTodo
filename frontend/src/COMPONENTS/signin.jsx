import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/signin.css"

const Signin = () => {

    const [useremail, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const inputs = document.querySelectorAll(".input-container input");
        const events = ["mouseenter", "click"]

        inputs.forEach((input) => {

            const spansOfLabelArray = new Array(input.nextSibling.children);  //will target the children of the next recent sibling of the current input as an array

            //will traverse all the elements present in the spansoflabelarray 
            spansOfLabelArray.forEach(spansofLabel => {   //spanoflabel is the array of all the spans present in the spansoflabelarray

                let len = spansofLabel.length;

                for (let i = 0; i < len; i++) {
                    spansofLabel[i].style.left = `${i * 10}px`
                }
            })
            events.forEach(evt => {

                input.addEventListener(evt, () => {

                    spansOfLabelArray.forEach(spansofLabel => {
                        let i = 0, len = spansofLabel.length;
                        let time = setInterval(() => {
                            i < len ? spansofLabel[i++].classList.add("wavySpan") : clearInterval(time)
                        }, 100)
                    })
                })

            })
            input.addEventListener("mouseleave", () => {

                spansOfLabelArray.forEach(spansofLabel => {
                    let i = 0, len = spansofLabel.length;
                    let time = setInterval(() => {
                        i < len ? spansofLabel[i++].classList.remove("wavySpan") : clearInterval(time)
                    }, 100)
                })
            })
            // console.log(input.validity.valid); return true if the input is valid else returns false
        })
    })

    const showPassword = () => {
        let pass_field = document.getElementById("password");

        if (pass_field.type === "password") {
            pass_field.type = "text"
        } else {
            pass_field.type = "password"
        }
    }

    const gotohomepage = () => {
        if (password === confirmpassword) {
            axios.post("http://localhost:8000/signin", { useremail, username, password })
                .then((res) => {
                    if (res.data === "trytologin") {
                        window.alert("Account already exists.....Try to login")
                    } else if (res.data === true) {
                        navigate("/homepage", { state: { useremail: useremail } });
                    } else if (res.data === false) {
                        window.alert("Something went wrong");
                    }
                })
                .catch((err) => window.alert("something went wrong..."))
        } else {
            window.alert("Password and confirm password must be same")
        }
    }

    const login=()=>{
        navigate("/");
    }

    return (
        <>
            <section className="signin-wrapper">
                    <div className="input-container">
                        <input type="email" name="email-field" id="email-field" onChange={(e) => setEmail(e.target.value)} required />
                        <label htmlFor="email-field">
                            <span>E</span>
                            <span>m</span>
                            <span>a</span>
                            <span>i</span>
                            <span>l</span>
                        </label>

                        <input type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} required />
                        <label htmlFor="username">
                            <span>U</span>
                            <span>s</span>
                            <span>e</span>
                            <span>r</span>
                            <span>n</span>
                            <span>a</span>
                            <span>m</span>
                            <span>e</span>
                        </label>
                        <span id="show-pass" onClick={showPassword}></span>
                        <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
                        <label htmlFor="password">
                            <span>P</span>
                            <span>a</span>
                            <span>s</span>
                            <span>s</span>
                            <span>w</span>
                            <span>o</span>
                            <span>r</span>
                            <span>d</span>
                        </label>

                        <input type="password" name="againPass" id="againPass" onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <label htmlFor="againPass">
                            <span>C</span>
                            <span>o</span>
                            <span>n</span>
                            <span>f</span>
                            <span>i</span>
                            <span>r</span>
                            <span>m</span>
                            <span> </span>
                            <span>p</span>
                            <span>a</span>
                            <span>s</span>
                            <span>s</span>
                        </label>
                        <button onClick={()=>login()}>Have An Account ?</button>
                        <button onClick={()=>gotohomepage()}>SIGN IN</button>
                    </div>
            </section>
        </>
    )
}

export default Signin;