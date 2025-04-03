"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, defaultValue, value, onValueChange, ...props }, ref) => {
        const [selectedTab, setSelectedTab] = React.useState(value || defaultValue || "")

        React.useEffect(() => {
            if (value !== undefined) {
                setSelectedTab(value)
            }
        }, [value])

        const contextValue = React.useMemo(() => ({
            value: selectedTab,
            onValueChange: (newValue: string) => {
                setSelectedTab(newValue)
                onValueChange?.(newValue)
            }
        }), [selectedTab, onValueChange])

        return (
            <TabsContext.Provider value={contextValue}>
                <div ref={ref} className={cn("", className)} {...props} data-value={selectedTab} />
            </TabsContext.Provider>
        )
    }
)
Tabs.displayName = "Tabs"

type TabsListProps = React.HTMLAttributes<HTMLDivElement>

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props}
        />
    )
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(TabsContext)
        const isActive = context?.value === value

        return (
            <button
                ref={ref}
                role="tab"
                aria-selected={isActive}
                data-state={isActive ? "active" : "inactive"}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                    className
                )}
                onClick={() => context?.onValueChange(value)}
                {...props}
            />
        )
    }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(TabsContext)
        const isActive = context?.value === value

        if (!isActive) return null

        return (
            <div
                ref={ref}
                role="tabpanel"
                data-state={isActive ? "active" : "inactive"}
                className={cn(
                    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            />
        )
    }
)
TabsContent.displayName = "TabsContent"

interface TabsContextValue {
    value: string
    onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

export { Tabs, TabsList, TabsTrigger, TabsContent } 