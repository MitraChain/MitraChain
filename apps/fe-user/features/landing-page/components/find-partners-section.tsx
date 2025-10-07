import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { MapPin, Search, Coffee, ShoppingBag, Utensils } from "lucide-react"
import Image from "next/image"

const categories = [
  { icon: Coffee, name: "Cafes", count: 120 },
  { icon: Utensils, name: "Food Stalls", count: 180 },
  { icon: ShoppingBag, name: "Retail", count: 150 },
]

export function FindPartnersSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Partner Network
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            Find <span className="text-primary">Partner UMKM</span> Near You
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover local businesses in your area and start earning rewards today
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for businesses..." className="pl-10" />
            </div>
            <Button>
              <MapPin className="mr-2 h-4 w-4" />
              Near Me
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {categories.map((category, index) => (
            <Card key={index} className="border-primary/10 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto">
                  <category.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} partners</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative rounded-2xl border border-primary/20 bg-card p-4 max-w-4xl mx-auto">
          <Image
            src="/illustration-digital-map-glowing-hexagon-nodes-mar.jpg"
            alt="Partner UMKM map"
            width={900}
            height={500}
            className="rounded-xl w-full"
          />
        </div>
      </div>
    </section>
  )
}
