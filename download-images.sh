#!/bin/bash

# Download Stock Photos Script
# This script downloads high-quality stock photos from Unsplash for the TCM clinic website

echo "📸 Downloading stock photos for Dr. Huang Clinic..."
echo "This will download 40+ images (~50MB total)"
echo ""

cd public/uploads/dr-huang-clinic

# Hero Images (1920x1080)
echo "⬇️  Downloading hero images..."
curl -L "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop" -o home/hero-bg.jpg
curl -L "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1920&h=1080&fit=crop" -o services/hero-bg.jpg
curl -L "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop" -o about/hero-bg.jpg
curl -L "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&h=1080&fit=crop" -o blog/hero-bg.jpg
curl -L "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=1080&fit=crop" -o contact/hero-bg.jpg
curl -L "https://images.unsplash.com/photo-1554224311-beee460201f9?w=1920&h=1080&fit=crop" -o pricing/hero-bg.jpg
curl -L "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&h=1080&fit=crop" -o conditions/hero-bg.jpg

# Dr. Huang Photos
echo "⬇️  Downloading doctor photos..."
curl -L "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop" -o about/dr-huang-portrait.jpg
curl -L "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&h=800&fit=crop" -o about/clinic-overview.jpg

# Service Photos (800x600)
echo "⬇️  Downloading service photos..."
curl -L "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop" -o services/acupuncture.jpg
curl -L "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=600&fit=crop" -o services/herbs.jpg
curl -L "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&h=600&fit=crop" -o services/cupping.jpg
curl -L "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop" -o services/moxibustion.jpg
curl -L "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop" -o services/tuina.jpg
curl -L "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop" -o services/gua-sha.jpg
curl -L "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop" -o services/dietary.jpg
curl -L "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop" -o services/lifestyle.jpg

# Clinic Gallery Photos (1200x800)
echo "⬇️  Downloading clinic photos..."
curl -L "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop" -o gallery/reception-area.jpg
curl -L "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=800&fit=crop" -o gallery/treatment-room-1.jpg
curl -L "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&h=800&fit=crop" -o gallery/treatment-room-2.jpg
curl -L "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&h=800&fit=crop" -o gallery/herbal-pharmacy.jpg
curl -L "https://images.unsplash.com/photo-1629909615957-be38f7ff5da6?w=1200&h=800&fit=crop" -o gallery/waiting-area.jpg
curl -L "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?w=1200&h=800&fit=crop" -o gallery/consultation-room.jpg
curl -L "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop" -o gallery/exterior.jpg
curl -L "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=800&fit=crop" -o gallery/acupuncture-needles.jpg
curl -L "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&h=800&fit=crop" -o gallery/cupping-setup.jpg
curl -L "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&h=800&fit=crop" -o gallery/herbal-jars.jpg
curl -L "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&h=800&fit=crop" -o gallery/treatment-table.jpg
curl -L "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&h=800&fit=crop" -o gallery/relaxation-room.jpg

# Blog Featured Images (1200x630)
echo "⬇️  Downloading blog images..."
curl -L "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=630&fit=crop" -o blog/spring-health.jpg
curl -L "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=630&fit=crop" -o blog/acupuncture-pain.jpg
curl -L "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=630&fit=crop" -o blog/immune-system.jpg
curl -L "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=630&fit=crop" -o blog/stress-management.jpg
curl -L "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=630&fit=crop" -o blog/digestive-health.jpg
curl -L "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&h=630&fit=crop" -o blog/herbal-medicine.jpg

# Case Studies Images
echo "⬇️  Downloading case study images..."
curl -L "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=800&fit=crop" -o case-studies/chronic-pain.jpg
curl -L "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=800&fit=crop" -o case-studies/migraine.jpg
curl -L "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=800&fit=crop" -o case-studies/fertility.jpg

# Additional homepage images
echo "⬇️  Downloading homepage images..."
curl -L "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200&h=800&fit=crop" -o home/welcome-section.jpg
curl -L "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop" -o home/why-tcm.jpg
curl -L "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&h=600&fit=crop" -o home/testimonials-bg.jpg

echo ""
echo "✅ Download complete!"
echo "📁 Images saved to: public/uploads/dr-huang-clinic/"
echo ""
echo "Total images downloaded: 40+"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to see the images"
echo "2. Visit http://localhost:3003"
echo "3. All pages should now show real photos instead of placeholders"
