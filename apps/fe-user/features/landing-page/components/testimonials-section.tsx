import { Card, CardContent } from "@workspace/ui/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Wijaya",
    role: "Regular Customer",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "Mitrachain has completely changed how I shop locally. I love supporting UMKM businesses and earning rewards at the same time!",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Coffee Shop Owner",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "As a small business owner, Mitrachain has helped me retain customers and grow my business. The blockchain transparency builds trust.",
    rating: 5,
  },
  {
    name: "Rina Kusuma",
    role: "Food Enthusiast",
    avatar: "/placeholder.svg?height=100&width=100",
    content: "I've discovered so many amazing local businesses through Mitrachain. The rewards are just a bonus!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl">
            What Our <span className="text-primary">Community Says</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of satisfied users and business owners in the Mitrachain ecosystem
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-primary/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative rounded-2xl border border-accent/20 bg-card p-4 max-w-3xl mx-auto">
          <Image
            src="/minimalist-futuristic-illustration-happy-users-on-.jpg"
            alt="User testimonials"
            width={800}
            height={300}
            className="rounded-xl w-full"
          />
        </div>
      </div>
    </section>
  )
}
