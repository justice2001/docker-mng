import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col justify-center items-center gap-4 h-dvh">
            <img src="https://raw.githubusercontent.com/SAWARATSUKI/KawaiiLogos/refs/heads/main/ResponseCode/404%20NotFound.png"
            className="w-96" />
            <h1 className="text-3xl">404 NotFound!</h1>
            <Button onClick={() => navigate(-1)}><ArrowLeftIcon /> Back</Button>
        </div>
    )
}