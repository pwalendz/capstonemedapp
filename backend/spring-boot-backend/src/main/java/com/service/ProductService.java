package com.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entity.Product;
import com.repository.ProductRepository;

@Service
public class ProductService {

	@Autowired
	ProductRepository productRepository;
	
	public String storeProduct(Product product) {
		productRepository.save(product);
		return "Product details stored successfully";
	}
	
	public List<Product> findAllProducts() {
		return productRepository.findAll();
	}

	  public Product findById(int pid) {
	        return productRepository.findById(pid).orElse(null);
	    }
	  
	  public void decrementQty(int pid, int pidqty) {
	        Optional<Product> result = productRepository.findById(pid);
	        if (result.isPresent()) {
	            Product p = result.get();

	            if (p.getQty() >= pidqty) {
	                p.setQty(p.getQty() - pidqty);
	                productRepository.saveAndFlush(p);
	            } else {
	                throw new IllegalArgumentException("Ordered quantity exceeds available stock for product: " + p.getPname());
	            }
	        } else {
	            throw new NoSuchElementException("Product not found with ID: " + pid);
	        }
	    }

	public String updateProduct(Product updatedProduct) {
        Optional<Product> result = productRepository.findById(updatedProduct.getPid());

        if (result.isPresent()) {
            Product existingProduct = result.get();
            // Update the relevant fields of the existing product with the values from updatedProduct
            existingProduct.setPname(updatedProduct.getPname());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setQty(updatedProduct.getQty());

            productRepository.save(existingProduct);
            return "Product details updated successfully";
        } else {
            return "Product not found for updating";
        }
    }
	public String deleteProduct(int productId) {
        Optional<Product> result = productRepository.findById(productId);

        if (result.isPresent()) {
            productRepository.deleteById(productId);
            return "Product deleted successfully";
        } else {
            return "Product not found for deletion";
        }
    }
}
