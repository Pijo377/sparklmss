import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"

export interface PasswordFieldProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    showToggle?: boolean
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({ className, showToggle = true, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)

        const togglePasswordVisibility = () => {
            setShowPassword((prev) => !prev)
        }

        return (
            <div className="relative">
                <Input
                    type={showPassword ? "text" : "password"}
                    className={cn("pr-10", className)}
                    ref={ref}
                    {...props}
                />
                {showToggle && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                        </span>
                    </Button>
                )}
            </div>
        )
    }
)
PasswordField.displayName = "PasswordField"

export { PasswordField }
