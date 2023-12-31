import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/login.css";
import img from "../IMAGES/GON.jpg";
const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const inputs = document.querySelectorAll(".input-container input");
        const background = document.querySelector(".login-wrapper");
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

        let count = 1;
        let countTemp = count - 1;
        setInterval(() => {
            background.classList.remove(`image${countTemp}`)
            background.classList.add(`image${count}`)
            if (count < 11) {
                count++;
                countTemp = count - 1;
            } else {
                countTemp = count;
                count = 1;
            }
        }, 2000)
    })

    const showPassword = () => {
        let pass_field = document.getElementById("password");

        if (pass_field.type === "password") {
            pass_field.type = "text"
        } else {
            pass_field.type = "password"
        }
    }

    const signin = () => {
        navigate("/signin");
    }

    const gotohomepage = () => {
        axios.post("/login", { email, password })
            .then((res) => {
                if (res.data == true) {
                    navigate("/homepage", { state: { useremail: email } });
                } else if (res.data == false) {
                    window.alert("Email or password is incorrect")
                }
            })
            .catch((error) => console.error(`error occured while logging the user at frontend =>>> ${error}`))
    }
    return (
        <>
            <section className="login-wrapper">
                <div className="input-container">
                    <input type="email" name="email-field" id="email-field" onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="email-field">
                        <span>E</span>
                        <span>m</span>
                        <span>a</span>
                        <span>i</span>
                        <span>l</span>
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

                    <div className="other">
                        <a href="/#">Forgot Password</a>
                        <a href="/signin">New User ?</a>
                    </div>
                    <button onClick={() => gotohomepage()}>LOG IN</button>
                </div>
            </section>
        </>
    )
}

export default Login;