function calcularEdad(){
let nacimiento = new Date("1990-08-05")
let hoy = new Date()
let edad = hoy.getFullYear() - nacimiento.getFullYear()
let m = hoy.getMonth() - nacimiento.getMonth()

if(m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())){
edad--
}
document.getElementById("edad").innerText = edad
}

calcularEdad()

function sendLocation(){

if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(function(position){
let lat = position.coords.latitude
let lon = position.coords.longitude
let url = "https://www.google.com/maps?q="+lat+","+lon

alert("Ubicación generada:\n"+url)

})

}else{

alert("Geolocalización no soportada")

}

}

function setLanguage(lang){

if(lang === "en"){

document.getElementById("birth_label").innerText="Birth date:"
document.getElementById("age_label").innerText="Age:"
document.getElementById("id_label").innerText="ID:"
document.getElementById("nat_label").innerText="Nationality:"
document.getElementById("contact_label").innerText="Emergency Contact"
document.getElementById("alerta").innerText="⚠️ ALLERGIC TO NSAIDs"

}

if(lang === "es"){
document.getElementById("birth_label").innerText="Fecha nacimiento:"
document.getElementById("age_label").innerText="Edad:"
document.getElementById("id_label").innerText="Cédula:"
document.getElementById("nat_label").innerText="Nacionalidad:"
document.getElementById("contact_label").innerText="Contacto de Emergencia"
document.getElementById("alerta").innerText="⚠️ ALÉRGICO A LOS AINES"

}
}