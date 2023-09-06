import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/sharepage/services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  allOrders: any[] = [];
  orderDetails: any;
  sortByDate: boolean = false;
  sortByTotal: boolean = false;
  p: number = 1;

  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  getAllOrders() {
    this.orderService.getAllOrders().subscribe((orders) => {
      this.allOrders = orders;
      this.sortOrdersByDateDescending();
    });
  }

  showOrderDetails(order: any) {
    // Nếu chi tiết đã hiển thị, ẩn nó đi khi nhấn lại
    if (order.isDetailsShown) {
      order.isDetailsShown = false;
    } else {
      // Nếu chi tiết chưa hiển thị, hiển thị nó lên
      order.isDetailsShown = true;
    }
  }

  sortOrdersByDate() {
    this.sortByTotal = false; // Đặt lại trạng thái sắp xếp theo tổng tiền
    this.allOrders.sort((a, b) => a.orderTime.seconds - b.orderTime.seconds);
   
    }


  sortOrdersByDateDescending(){
    this.sortByTotal = false; // Đặt lại trạng thái sắp xếp theo tổng tiền
    this.allOrders.sort((a, b) => b.orderTime.seconds - a.orderTime.seconds); // Sắp xếp theo ngày giảm dần
  }

  sortOrdersByTotal() {
    this.sortByDate = false; // Đặt lại trạng thái sắp xếp theo ngày
    this.allOrders.sort((a, b) => a.total - b.total); // Sắp xếp theo tổng tiền tăng dần
  }

  sortOrdersByTotalDescending() {
    this.sortByDate = false; // Đặt lại trạng thái sắp xếp theo ngày
    this.allOrders.sort((a, b) => b.total - a.total); // Sắp xếp theo giá tiền giảm dần
  }
}
