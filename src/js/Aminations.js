import gsap from "gsap";

const Animations = {

    tableBeforeEnter: (el) => {
        el.style.transform = "translateX(-60px)";
        el.style.opacity = 0;
    },

    tableEnter: (el, done) => {
        gsap.to(el, {
            duration: 0.6,
            x: 0,
            opacity: 1,
            onComplete: done,
            delay: el.dataset.index * 0.1,
            ease: "power3.out",
        });
    },

    cardBeforeEnter: (el) => {
        el.style.transform = "translateY(60px)";
        el.style.opacity = 0;
    },

    cardEnter: (el, done) => {
        gsap.to(el, {
            duration: 0.6,
            y: 0,
            opacity: 1,
            onComplete: done,
            delay: el.dataset.index * 0.1,
            ease: "power3.out",
        });
    }


}

export { Animations } 