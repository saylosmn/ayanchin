import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "", as = "div" }) => {
    const MotionTag = motion[as] || motion.div;
    return (
        <MotionTag
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </MotionTag>
    );
};

export default Reveal;
