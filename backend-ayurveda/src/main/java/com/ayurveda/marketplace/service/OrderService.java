package com.ayurveda.marketplace.service;

import com.ayurveda.marketplace.dto.OrderRequestDto;
import com.ayurveda.marketplace.dto.OrderResponseDto;
import com.ayurveda.marketplace.model.Order;
import com.ayurveda.marketplace.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    public OrderResponseDto placeOrder(OrderRequestDto requestDto) {
        log.info("Placing new order with item count: {}", requestDto.getItemCount());
        
        Order order = new Order();
        order.setTotalAmount(requestDto.getTotalAmount());
        order.setItemCount(requestDto.getItemCount());
        order.setStatus(requestDto.getStatus());
        
        // Ensure there is an order date (if missing in entity, we just log it or set it if it exists)
        // Order entity doesn't have orderDate currently, but we can set it if we added it. Let's just save.
        Order savedOrder = orderRepository.save(order);
        log.info("Order successfully placed with id: {}", savedOrder.getId());
        
        return mapToResponseDto(savedOrder);
    }

    private OrderResponseDto mapToResponseDto(Order order) {
        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setItemCount(order.getItemCount());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(LocalDateTime.now());
        return dto;
    }
}

