import { Button } from "@/components/ui/button"

export function PageHeader({
  title,
  description,
  actions
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-gray-500 mt-2">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-4">
          {actions}
        </div>
      )}
    </div>
  )
} 