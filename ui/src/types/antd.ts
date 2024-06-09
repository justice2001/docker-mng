export type BadgeStatus = "success" | "processing" | "error" | "default" | "warning" | undefined;

export type BadgeMap = {
    status: BadgeStatus,
    text: string
};
