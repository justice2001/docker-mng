import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface DTooltipProps {
    tips: string,
    children: JSX.Element | JSX.Element[]
}

export const DTooltip = ({tips, children}: DTooltipProps) => (
    <TooltipProvider>
        <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
            <p>{tips}</p>
        </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)