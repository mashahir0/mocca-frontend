
import { useState } from 'react'

export default function AboutUs() {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* About Section */}
      <section className="text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase">About Us</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm space-y-4">
          <h2 className="text-3xl font-bold">MOCCA</h2>
          <p className="text-gray-600 text-sm">
          MOCCA is a forward-thinking fashion brand focused on providing high-quality apparel for the modern individual. We specialize in unique, contemporary designs that reflect individuality and style, catering to all your fashion needs.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-start gap-4">
            <label htmlFor="email" className="w-24 pt-2 text-right">
              email :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 p-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="flex items-start gap-4">
            <label htmlFor="message" className="w-24 pt-2 text-right">
              message :
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="flex-1 p-2 bg-gray-100 rounded resize-none focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded hover:bg-black/90 transition-colors"
            >
              sent
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}