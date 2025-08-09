const linkInput = document.getElementById("image_link");
const image = document.querySelector("img");

//update image when link is added
linkInput.addEventListener('input', async function() {
    const link = linkInput.value;

    //if the url is valid, add it to the picture as a preview
    if (await isImgUrl(link)) {
        console.log("it is image")
        image.setAttribute("src",link);
        image.classList.toggle("hidden", false);
    } else {
        console.log("not image");
        image.setAttribute("src","");
        image.classList.toggle("hidden", true);
    }
})

//from https://www.zhenghao.io/posts/verify-image-url
async function isImgUrl(url) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}