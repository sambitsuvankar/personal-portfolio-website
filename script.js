console.clear();

const { gsap, imagesLoaded } = window;

const buttons = {
	prev: document.querySelector(".btn--left"),
	next: document.querySelector(".btn--right"),
};
const cardsContainerEl = document.querySelector(".cards__wrapper");

const cardInfosContainerEl = document.querySelector(".info__wrapper");

buttons.next.addEventListener("click", () => swapCards("right"));

buttons.prev.addEventListener("click", () => swapCards("left"));

function swapCards(direction) {
    console.log(direction)
	const currentCardEl = cardsContainerEl.querySelector(".current--card");
	const previousCardEl = cardsContainerEl.querySelector(".previous--card");
	const nextCardEl = cardsContainerEl.querySelector(".next--card");


	changeInfo(direction);
	swapCardsClass();

	removeCardEvents(currentCardEl);

	function swapCardsClass() {
		currentCardEl.classList.remove("current--card");
		previousCardEl.classList.remove("previous--card");
		nextCardEl.classList.remove("next--card");


		currentCardEl.style.zIndex = "50";

		if (direction === "right") {
			previousCardEl.style.zIndex = "20";
			nextCardEl.style.zIndex = "30";


			currentCardEl.classList.add("previous--card");
			previousCardEl.classList.add("next--card");
			nextCardEl.classList.add("current--card");

		} else if (direction === "left") {
			previousCardEl.style.zIndex = "30";
			nextCardEl.style.zIndex = "20";


			currentCardEl.classList.add("next--card");
			previousCardEl.classList.add("current--card");
			nextCardEl.classList.add("previous--card");

		}
	}
}

function changeInfo(direction) {
	let currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	let previousInfoEl = cardInfosContainerEl.querySelector(".previous--info");
	let nextInfoEl = cardInfosContainerEl.querySelector(".next--info");

	gsap.timeline()
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 0.5,
		pointerEvents: "none",
	})
		.to(
		currentInfoEl.querySelectorAll(".text"),
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "-120px",
			opacity: 0,
		},
		"-="
	)
		.call(() => {
		swapInfosClass(direction);
	})
		.call(() => initCardEvents())
		.fromTo(
		direction === "right"
		? nextInfoEl.querySelectorAll(".text")
		: previousInfoEl.querySelectorAll(".text"),
		{
			opacity: 0,
			translateY: "40px",
		},
		{
			duration: 0.4,
			stagger: 0.1,
			translateY: "0px",
			opacity: 1,
		}
	)
		.to([buttons.prev, buttons.next], {
		duration: 0.2,
		opacity: 1,
		pointerEvents: "all",
	});

	function swapInfosClass() {
		currentInfoEl.classList.remove("current--info");
		previousInfoEl.classList.remove("previous--info");
		nextInfoEl.classList.remove("next--info");

		if (direction === "right") {
			currentInfoEl.classList.add("previous--info");
			nextInfoEl.classList.add("current--info");
			previousInfoEl.classList.add("next--info");
		} else if (direction === "left") {
			currentInfoEl.classList.add("next--info");
			nextInfoEl.classList.add("previous--info");
			previousInfoEl.classList.add("current--info");
		}
	}
}

function updateCard(e) {
	const card = e.currentTarget;
	const box = card.getBoundingClientRect();
	const centerPosition = {
		x: box.left + box.width / 2,
		y: box.top + box.height / 2,
	};
	let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
	gsap.set(card, {
		"--current-card-rotation-offset": `${angle}deg`,
	});
	const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	gsap.set(currentInfoEl, {
		rotateY: `${angle}deg`,
	});
}

function resetCardTransforms(e) {
	const card = e.currentTarget;
	const currentInfoEl = cardInfosContainerEl.querySelector(".current--info");
	gsap.set(card, {
		"--current-card-rotation-offset": 0,
	});
	gsap.set(currentInfoEl, {
		rotateY: 0,
	});
}

function initCardEvents() {
	const currentCardEl = cardsContainerEl.querySelector(".current--card");
	currentCardEl.addEventListener("pointermove", updateCard);
	currentCardEl.addEventListener("pointerout", (e) => {
		resetCardTransforms(e);
	});
}

initCardEvents();

function removeCardEvents(card) {
	card.removeEventListener("pointermove", updateCard);
}

function init() {

	let tl = gsap.timeline();

	tl.to(cardsContainerEl.children, {
		delay: 0.15,
		duration: 0.5,
		stagger: {
			ease: "power4.inOut",
			from: "right",
			amount: 0.1,
		},
		"--card-translateY-offset": "0%",
	})
		.to(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
		delay: 0.5,
		duration: 0.4,
		stagger: 0.1,
		opacity: 1,
		translateY: 0,
	})
		.to(
		[buttons.prev, buttons.next],
		{
			duration: 0.4,
			opacity: 1,
			pointerEvents: "all",
		},
		"-=0.4"
	);
}

const waitForImages = () => {
	const images = [...document.querySelectorAll("img")];
	const totalImages = images.length;
	let loadedImages = 0;
	const loaderEl = document.querySelector(".loader span");

	gsap.set(cardsContainerEl.children, {
		"--card-translateY-offset": "100vh",
	});
	gsap.set(cardInfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
		translateY: "40px",
		opacity: 0,
	});
	gsap.set([buttons.prev, buttons.next], {
		pointerEvents: "none",
		opacity: "0",
	});

	images.forEach((image) => {
		imagesLoaded(image, (instance) => {
			if (instance.isComplete) {
				loadedImages++;
				let loadProgress = loadedImages / totalImages;

				gsap.to(loaderEl, {
					duration: 1,
					scaleX: loadProgress,
					backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
				});

				if (totalImages == loadedImages) {
					gsap.timeline()
						.to(".loading__wrapper", {
						duration: 0.8,
						opacity: 0,
						pointerEvents: "none",
					})
						.call(() => init());
				}
			}
		});
	});
};

waitForImages();

///////////////////////////
// NAvbar Toggle

let nav = document.querySelector(".hambug")
nav.addEventListener("click", ()=>{
	document.querySelector(".hambug").classList.toggle("change");
	document.querySelector(".hambg").classList.toggle("change");
	document.querySelector(".hamItems").classList.toggle("itemChange");
	document.getElementById("hambug-bg").classList.toggle("change");
})

// Swiper js
var swiper = new Swiper('.swiper-container', {
	direction: 'vertical',
	slidesPerView: 1,
	spaceBetween: 30,
	mousewheel: true,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
});


// Scroll behaviour on navLink clicks

const section0 = document.getElementById('section0')
const section1 = document.getElementById('section1');
const section2 = document.getElementById('section2');
const section3 = document.getElementById('section3');
const section4 = document.querySelector('#section4');

const s1coords = section1.getBoundingClientRect()
console.log(s1coords)

const navText = document.querySelectorAll('.navElContainer');

navText.forEach(nav => nav.addEventListener('click', function(e){
	console.log(e.target.getBoundingClientRect())

	// section1.scrollIntoView({behavior: 'smooth'})
	console.log(e.target.classList.contains('navText'))

	if (e.target.classList.contains('about')){
		// window.scrollTo({
		// 	left : s1coords.left + window.pageXOffset,
		// 	top :  s1coords.top + window.pageYOffset,
		// 	behavior : 'smooth',   // For a smooth animation
		// }) 
		section1.scrollIntoView({behavior: 'smooth'})
	}
	if (e.target.classList.contains('projects')){
		section2.scrollIntoView({behavior: 'smooth'})
	}
	if (e.target.classList.contains('skills')){
		section3.scrollIntoView( {behavior: 'smooth'})
	}
	if (e.target.classList.contains('contactme')){
		section4.scrollIntoView({behavior: 'smooth'})
	}
	if (e.target.classList.contains('home')){
		section0.scrollIntoView({behavior: 'smooth'})
	}

}))


// document.addEventListener('scroll', () =>{
// 	console.log('currentScroll (X/Y)', window.pageXOffset ,window.pageYOffset)

// })

// Sticky Navbar-----------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function(e){
	if(window.scrollY > s1coords.top){
		navbar.classList.add('sticky')
	}
	else if(window.scrollY < s1coords.top){
		navbar.classList.remove('sticky')
	}
})

// HamBurger Nav links scroll------------

const hamItems = document.querySelector('.hamItems');
hamItems.addEventListener('click', (e) => {
	const clicked = e.target.closest('.hamItem');
	if(!clicked) return;
	
	const activeNum = clicked.dataset.tab;

	// if (clicked.dataset.tab == 0)

	document.getElementById(`section${activeNum}`).scrollIntoView({behavior: 'smooth'})

	document.querySelector(".hambug").classList.toggle("change");
	document.querySelector(".hambg").classList.toggle("change");
	document.querySelector(".hamItems").classList.toggle("itemChange");
	document.getElementById("hambug-bg").classList.toggle("change");
});

