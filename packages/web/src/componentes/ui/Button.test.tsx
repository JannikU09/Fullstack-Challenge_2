import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

afterEach(() => {
    cleanup();
});

describe("Button", () => {
    it("rendert Button", async () => {
        render(<Button variant="primary">Test</Button>);
        expect(await screen.findByText("Test")).toBeInTheDocument();
    });

    it("prüft onClick()", async () => {
        const handleClick = vi.fn();
        render(
            <Button variant="primary" onClick={handleClick}>
                onClick
            </Button>,
        );
        await userEvent.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
