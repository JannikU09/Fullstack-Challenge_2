"use client"

import { useAtomValue } from "jotai";
import { dateAtom } from "../utils/atoms";

export const DateDisplay = () => {
    const date = useAtomValue(dateAtom);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "18px",
                // marginTop: "30px"
            }}
        >
            {date}
        </div>
    );
};
