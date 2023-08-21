package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entity.Orders;
import com.repository.OrdersRepository;

@Service
public class OrdersService {

	@Autowired
	OrdersRepository ordersRepository;
	
	public String placeOrder(Orders order) {
		ordersRepository.save(order);
		return "Order placed successfully";
	}
	
	public List<Orders> viewAllOrderDetails() {
		return ordersRepository.findAll();
	}
	public List<Orders> viewOrderDetailsByEmail(String email) {
	    return ordersRepository.findByAccountEmail(email);
	}
}
