import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8087/";

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) {
  }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/products');
  }
  addCoupon(couponDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/coupons/creat', couponDto);
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/search/${query}`);
  }

  // Récupérer les produits filtrés

    // marketplace.service.ts
    getAllProductsByName(filters: { category: any; sortBy: any }): Observable<any> {
        // Vous pouvez ajuster l'URL en fonction de vos paramètres
        const { category, sortBy } = filters;
        return this.http.get(`${BASIC_URL}api/admin/search`, {
            params: { category, sortBy }
        });
    }




    getCouponById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/coupons/' + id);
  }


  increaseProductQuantity(productId: any): Observable<any> {
    const cartDto = {productId};
    return this.http.post(BASIC_URL + 'api/customer/increase-quantity', cartDto);
  }

  decreaseProductQuantity(productId: any): Observable<any> {
    const cartDto = {productId};
    return this.http.post(BASIC_URL + 'api/customer/decrease-quantity', cartDto);
  }

  // Ajouter la méthode pour supprimer un produit du panier
  removeProductFromCart(productId: any): Observable<any> {
    return this.http.delete(BASIC_URL + `api/customer/cart/${productId}`);
  }

  updateCategory(categoryId: any, categoryDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/category/${categoryId}`, categoryDto);
  }


  getCategoryById(categoryId: any): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/category/${categoryId}`);
  }


  getCart(): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/cart`);
  }


  applyCoupon(code: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/apply-coupon/${code}`, {});
  }


  placeOrder(orderDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/customer/place-order', orderDto);
  }

  getOrders(): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/myOrders`);
  }

  getOrderedProducts(orderId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/ordered-products/${orderId}`);
  }

  giveReview(reviewDto: any): Observable<any> {
    return this.http.post(BASIC_URL + `api/customer/review`, reviewDto);
  }

  getProductDetailById(productId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/product/${productId}`);
  }

  addProductToWishlist(wishlistDto: any): Observable<any> {
    return this.http.post(BASIC_URL + `api/customer/wishlist`, wishlistDto);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/admin/product/${productId}`);
  }
  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/admin/category/${categoryId}`);
  }

  getPlacedOrders(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/placedOrders');
  }

  changeOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/order/${orderId}/${status}`, {});
  }


  updateProduct(productId:any, productDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/product/${productId}`, productDto);
  }
  addProduct(productDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/product', productDto);
  }
  getProductById(productId:number): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/product/${productId}`);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/categories');
  }
    deleteFromWishlist(productId: number): Observable<any> {
        return this.http.delete(BASIC_URL + `api/customer/wishlist/product/${productId}`);
    }

  getWishlist(): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/wishlist`);
  }
  addProductToCart(addProductInCartDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/customer/cart', addProductInCartDto);
  }
  addToCart(addProductInCartDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/customer/add', addProductInCartDto);
  }


  addCategory(categoryDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/category', categoryDto);
  }


}
