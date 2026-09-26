"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Fades content up once when it scrolls into view. MotionConfig in the layout drops the movement for reduced-motion users. */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
      {...props}
    />
  );
}

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

/** A list whose items appear one after another. Use with RevealItem children. */
export function RevealList({ ordered = false, ...props }: HTMLMotionProps<"ul"> & { ordered?: boolean }) {
  const shared = {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.2 },
    variants: listVariants,
  } as const;
  return ordered ? (
    <motion.ol {...shared} {...(props as HTMLMotionProps<"ol">)} />
  ) : (
    <motion.ul {...shared} {...props} />
  );
}

export function RevealItem(props: HTMLMotionProps<"li">) {
  return <motion.li variants={itemVariants} {...props} />;
}
