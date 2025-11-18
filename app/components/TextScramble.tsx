"use client";
import { useEffect, useRef, useState } from "react";

class ScrambleChar {
    private static CHARS = "!<>-_\\/[]{}—=+*^?#________";

    private from: string;
    private to: string;
    private currentChar: string = "";

    private start: number;
    private end: number;

    private time;

    private complete = false;

    constructor(from: string = "", to: string = "", start: number, interval: number) {
        this.from = from;
        this.to = to;

        this.start = start;
        this.end = start + 5 * interval + Math.random() * 3 * interval; // Randomize end time
        this.time = performance.now();
        this.currentChar = this.randomChar();
    }

    public toString(): string {
        if (this.complete) {
            return this.to;
        }

        const now = performance.now();
        const diff = now - this.time;

        if (diff < this.start) {
            return this.from;
        } else if (diff >= this.end) {
            this.complete = true;
            return this.to;
        } else {
            if (Math.random() < 0.1) {
                this.currentChar = this.randomChar();
            }

            return `<span class="dud">${this.currentChar}</span>`
        }
    }

    private randomChar(): string {
        return ScrambleChar.CHARS[Math.floor(Math.random() * ScrambleChar.CHARS.length)];
    }

    public isComplete(): boolean {
        return this.complete;
    }
}

class Scrambler {
    private CHARS = "!<>-_\\/[]{}—=+*^?#________";
    private el: HTMLElement;

    private queue: Array<ScrambleChar> = [];

    private interval = 50; // milliseconds
    private lastUpdate = 0;

    private resolve: ((value: any) => void) | null = null;

    constructor(el: HTMLElement) {
        this.el = el;
    }

    public setText(newText: string) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);

        this.queue = Array.from({ length }, (_, i) =>
            new ScrambleChar(oldText[i] || "", newText[i] || "", i * this.interval, this.interval)
        )

        const promise = new Promise((resolve) => (this.resolve = resolve))

        this.update();

        return promise;
    }

    private update() {
        if (this.queue.length === 0) {
            return;
        }

        let output = "";
        let complete = true;

        for (const char of this.queue) {
            output += char.toString();
            if (!char.isComplete()) {
                complete = false;
            }
        }

        this.el.innerHTML = output;

        if (complete) {
            this.resolve && this.resolve(null);
            return;
        }

        requestAnimationFrame(() => this.update());
    }

    private scrambleQueue() {
        return this.queue.map(() => this.randomChar()).join("");
    }

    private randomChar() {
        return this.CHARS[Math.floor(Math.random() * this.CHARS.length)];
    }
}

export default function TextScramble({ phrases, interval = 1500 }: { phrases: string[]; interval?: number }) {
    const textRef = useRef(null);
    const scramblerRef = useRef<Scrambler | null>(null);

    useEffect(() => {
        if (!textRef.current) return;

        scramblerRef.current = new Scrambler(textRef.current);

        let activePhrase = 0;

        const next = () => {
            if (!scramblerRef.current) return;

            scramblerRef.current!.setText(phrases[activePhrase]).then(() => {
                setTimeout(next, interval);
            });
            activePhrase = (activePhrase + 1) % phrases.length;
        }

        next();
    }, [phrases, interval]);

    return (
        <div className="h-16 flex items-center justify-center flex flex-col gap-4">
            <div className="text-4xl font-mono text-center" ref={textRef}>
                {phrases.length > 0 ? phrases[0] : ""}
            </div>
        </div>
    );
}
