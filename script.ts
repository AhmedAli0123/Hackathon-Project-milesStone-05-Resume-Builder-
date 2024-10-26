declare const html2pdf:any;


// Get form and preview elements
const form = document.getElementById("resumeForm") as HTMLFormElement;
const resumePage = document.getElementById("resumePage") as HTMLElement;
const resumePhoto = document.getElementById("resumePhoto") as HTMLImageElement;
const resumeName = document.getElementById("resumeName") as HTMLHeadingElement;
const resumeEmail = document.getElementById("resumeEmail") as HTMLParagraphElement;
const resumePhone = document.getElementById("resumePhone") as HTMLParagraphElement;
const resumeEducation = document.getElementById("resumeEducation") as HTMLParagraphElement;
const resumeWorkExperience = document.getElementById("resumeWorkExperience") as HTMLParagraphElement;
const resumeSkills = document.getElementById("resumeSkills") as HTMLParagraphElement;
const backButton = document.getElementById("backButton") as HTMLButtonElement;
const resumeContent = document.getElementById("resumeContent") as HTMLDivElement;
const editButton = document.getElementById("editButton") as HTMLButtonElement;
const shareLinkButton = document.getElementById("shareLinkButton") as HTMLButtonElement;
const  downloadButton = document.getElementById("download-pdf") as HTMLButtonElement;


// Handle form submission
form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    // Collect form values
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const degree = (document.getElementById("degree") as HTMLInputElement).value;
    const education = (document.getElementById("education") as HTMLInputElement).value;
    const workExperience = (document.getElementById("workExperience") as HTMLTextAreaElement).value;
    const skills = (document.getElementById("skills") as HTMLTextAreaElement).value;

    const photoInput = document.getElementById("photo") as HTMLInputElement;
    const photoFile = photoInput.files ? photoInput.files[0] : null;

    if (photoFile) {
        const photoBase64 = await fileToBase64(photoFile);
        localStorage.setItem("resumePhoto", photoBase64);
        resumePhoto.src = photoBase64;
    }

    document.querySelector(".container")?.classList.add("hidden");
    resumePage.classList.remove("hidden");

    resumeName.textContent = `  ${name}`;
    resumeEmail.textContent = `Email:  ${email}`;
    resumePhone.textContent = `Phone:  ${phone}`;
    resumeEducation.textContent = `${degree} From  ${education}`;
    resumeWorkExperience.textContent = `${workExperience}`;
    resumeSkills.textContent = `${skills}`;


    // Generate URL Button


        const querParams = new  URLSearchParams({
            name :name,
            email: email,
            phone: phone,
            degree: degree,
            education: education,
            workExperience: workExperience,
            skills: skills,
        });


        const uniqueURL = `${window.location.origin}? ${querParams.toString()}`
        shareLinkButton.addEventListener("click", () => {
            navigator.clipboard.writeText(uniqueURL).then(() => {
                alert("Your shareable link is copied");
            }).catch(err => {
                console.error("Failed to copy: ", err);
            });
        });

        window.history.replaceState(null,"",querParams.toString())
        

});


function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


// Handle edit button click
editButton.addEventListener("click", () => {
    document.querySelector(".container")?.classList.remove("hidden");
    resumePage.classList.add("hidden");
    
    const [degree, education] = (resumeEducation.textContent || "").split(" from ");

    (document.getElementById("name") as HTMLInputElement).value = resumeName.textContent || "";
    (document.getElementById("email") as HTMLInputElement).value = (resumeEmail.textContent || "").replace("Email: ", "") || "";
    (document.getElementById("phone") as HTMLInputElement).value = (resumePhone.textContent || "").replace("Phone: ", "") || "";
    (document.getElementById("degree") as HTMLInputElement).value = degree || '';
    (document.getElementById("education") as HTMLInputElement).value = education || '';
    (document.getElementById("workExperience") as HTMLTextAreaElement).value = resumeWorkExperience.textContent || "";
    (document.getElementById("skills") as HTMLTextAreaElement).value = resumeSkills.textContent || "";
});

downloadButton.addEventListener("click", () => {
    if (typeof html2pdf === "undefined") {
        alert("Error: HTML2PDF library is not loaded");
        return;
    }

    const resumeOptions = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(resumeContent).set(resumeOptions).save().catch((error: Error) => {
        console.error('PDF generation error:', error);
    });
});


window.addEventListener("load", () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || '';
    const email = params.get('email') || '';
    const phone = params.get('phone') || '';
    const degree = params.get('degree') || '';
    const education = params.get('education') || '';
    const workExperience = params.get('workExperience') || '';
    const skills = params.get('skills') || '';

    if (name || email || phone || degree || education || workExperience || skills) {
        // Populate the resume preview if query params are present
        resumeName.textContent = `Name: ${name}`;
        resumeEmail.textContent = `Email: ${email}`;
        resumePhone.textContent = `Phone: ${phone}`;
        resumeEducation.textContent = `${degree} from ${education}`;
        resumeWorkExperience.textContent = workExperience;
        resumeSkills.textContent = skills;

        const savedPhoto = localStorage.getItem("resumePhoto");
        if (savedPhoto) {
            resumePhoto.src = savedPhoto;
        }

        // Hide form and show resume page
        document.querySelector(".container")?.classList.add("hidden");
        resumePage.classList.remove("hidden");
    }
});



// CSS for ensuring the image is styled properly
resumePhoto.style.width = "150px";  // Adjust width as per your requirement
resumePhoto.style.height = "150px";
resumePhoto.style.objectFit = "cover";
resumePhoto.style.borderRadius = "50%";  // Circular image
resumePhoto.style.display = "block";
resumePhoto.style.margin = "0 auto";