"use client"

import { useAtomValue } from "jotai";
import { dateAtom } from "../utils/atoms";

export const DateDisplay = () => {
    const date = useAtomValue(dateAtom);

    return (
        <div>
            {date}
        </div>
    );
};
