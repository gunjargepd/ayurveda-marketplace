package com.ayurveda.marketplace.config;

import com.ayurveda.marketplace.model.Product;
import com.ayurveda.marketplace.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder {

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    public void seedData() {
        if (productRepository.count() == 0) {
            List<Product> dummyProducts = Arrays.asList(
                createProduct("Triphala Churna (Digestive Support)", 450.00, 360.00, "Churnas", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Organic Ashwagandha Powder", 650.00, 520.00, "Churnas", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Shatavari Root Powder", 350.00, 297.50, "Churnas", "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Brahmi Churna (Brain Tonic)", 320.00, 256.00, "Churnas", "https://images.unsplash.com/photo-1611078810793-27e1f48644de?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Haritaki Powder (Detox)", 250.00, 225.00, "Churnas", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400&h=400"),
                
                createProduct("Bhringraj Hair Oil", 550.00, 440.00, "Oils", "https://images.unsplash.com/photo-1512496229555-d3600f682570?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Mahanarayan Taila (Massage Oil)", 850.00, 680.00, "Oils", "https://images.unsplash.com/photo-1615397323602-9907c030fba9?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Jalauka Taila (Leech Oil)", 1200.00, 960.00, "Oils", "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Cold-Pressed Sesame Oil", 350.00, 315.00, "Oils", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Ksheerabala Taila", 950.00, 760.00, "Oils", "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400&h=400"),
                
                createProduct("Kumkumadi Tailam Serum", 2500.00, 1750.00, "Skincare", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Neem & Aloe Vera Face Wash", 250.00, 200.00, "Skincare", "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Sandalwood & Turmeric Soap", 180.00, 153.00, "Skincare", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Rose Water Toner (Gulab Jal)", 280.00, 252.00, "Skincare", "https://images.unsplash.com/photo-1618683100508-469b6623668f?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Multani Mitti (Fuller's Earth)", 220.00, 176.00, "Skincare", "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=400&h=400"),
                
                createProduct("Pure Shilajit Resin (Himalayan)", 3500.00, 2800.00, "Supplements", "https://images.unsplash.com/photo-1585255476685-6ec297800762?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Chyawanprash (Immunity Jam)", 650.00, 552.50, "Supplements", "https://images.unsplash.com/photo-1598284534795-7d52a2305a41?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Brahmi Vati Tablets", 450.00, 360.00, "Supplements", "https://images.unsplash.com/photo-1584308666744-24d5e1656f4e?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Giloy Ghanvati (Immunity)", 450.00, 360.00, "Supplements", "https://images.unsplash.com/photo-1611078810793-27e1f48644de?auto=format&fit=crop&q=80&w=400&h=400"),
                createProduct("Amla Juice Concentrate", 420.00, 357.00, "Supplements", "https://images.unsplash.com/photo-1618683100508-469b6623668f?auto=format&fit=crop&q=80&w=400&h=400")
            );
            productRepository.saveAll(dummyProducts);
            System.out.println("? Inserted 20 dummy Ayurvedic products into SQLite!");
        }
    }

    private Product createProduct(String title, Double originalPrice, Double discountPrice, String category, String imageUrl) {
        Product p = new Product();
        p.setTitle(title);
        p.setOriginalPrice(originalPrice);
        p.setDiscountPrice(discountPrice);
        p.setCategory(category);
        p.setImageUrl(imageUrl);
        return p;
    }
}

