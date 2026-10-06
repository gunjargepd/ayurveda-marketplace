package com.ayurveda.marketplace.controller;

import com.ayurveda.marketplace.dto.OrderRequestDto;
import com.ayurveda.marketplace.dto.OrderResponseDto;
import com.ayurveda.marketplace.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDto> placeOrder(@RequestBody OrderRequestDto requestDto) {
        log.info("REST request to place an order");
        OrderResponseDto responseDto = orderService.placeOrder(requestDto);
        return ResponseEntity.ok(responseDto);
    }
}

