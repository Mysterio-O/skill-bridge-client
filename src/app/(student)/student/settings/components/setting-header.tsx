import React from "react";

export default function SettingsHeader({from}:{from?:string}) {
    return (
        <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">
                Update your {from === "admin" ? "admin" : "student"} profile information.
            </p>
        </div>
    );
}
