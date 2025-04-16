import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {loadStripe} from "@stripe/stripe-js";

const BASIC_URL = "http://localhost:8087/";

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private stripePromise = loadStripe('pk_test_51QwtvpR88uyR8EQrqAq8qSIJ61ZsTAUtltcDU3EDqhVBgvQFVH08F5SUsngiPiu2AHTsx5feb7ejgLmfpNDQLiyN00hpHvt7Wk');

  constructor(private http: HttpClient) {
  }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/products');
  }
  getOrderAnalytics(): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/order/analytics`);
  }
  addCoupon(couponDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/coupons/creat', couponDto);
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/search/${query}`);
  }

  searchCategories(query: string): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/categories/search`, {
      params: { name: query }  // ou tout autre paramètre que vous voulez rechercher
    });
  }

  isCouponUsed(id: number): Observable<boolean> {
    return this.http.get<boolean>(BASIC_URL + `api/admin/coupons/isUsed/${id}`);
  }

  getCoupons(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/coupons');
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

  deleteCoupon(id: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/admin/coupons/delete/${id}`);
  }


  // increaseProductQuantity(productId: any): Observable<any> {
  //   const cartDto = {productId};
  //   return this.http.post(BASIC_URL + 'api/customer/increase-quantity', cartDto);
  // }
  //
  // decreaseProductQuantity(productId: any): Observable<any> {
  //   const cartDto = {productId};
  //   return this.http.post(BASIC_URL + 'api/customer/decrease-quantity', cartDto);
  // }

  increaseProductQuantity(productId: any, userId: number): Observable<any> {
    const cartDto = { productId };
    return this.http.post(BASIC_URL + `api/customer/increase-quantity/${userId}`, cartDto);
  }

  decreaseProductQuantity(productId: any, userId: number): Observable<any> {
    const cartDto = { productId };
    return this.http.post(BASIC_URL + `api/customer/decrease-quantity/${userId}`, cartDto);
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


  // getCart(): Observable<any> {
  //   return this.http.get(BASIC_URL + `api/customer/cart`);
  // }
  getCart(userId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/cart/${userId}`);
  }


  // applyCoupon(code: string): Observable<any> {
  //   return this.http.post(`${BASIC_URL}api/customer/apply-coupon/${code}`, {});
  // }
  applyCoupon(userId: number, code: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/apply-coupon/${userId}/${code}`, {});
  }


  // placeOrder(orderDto: any): Observable<any> {
  //   return this.http.post(BASIC_URL + 'api/customer/place-order', orderDto);
  // }

  placeOrder(userId: any, orderDto: any): Observable<any> {
    // Passer l'ID utilisateur et l'objet `orderDto` dans la requête
    return this.http.post(`${BASIC_URL}api/customer/place-order/${userId}`, orderDto);
  }

  // Récupérer les commandes d'un utilisateur (My Orders)
  getMyOrders(userId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/myOrders/${userId}`);
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

  // addProductToWishlist(wishlistDto: { productId: number }): Observable<any> {
  //   return this.http.post(`${BASIC_URL}api/customer/wishlist`, wishlistDto);
  // }

  addProductToWishlist(userId: number, wishlistDto: { productId: number }): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/wishlist/${userId}`, wishlistDto);
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
  // addProduct(productDto: any): Observable<any> {
  //   const formData = new FormData();
  //
  //   // Ajouter les champs de productDto au FormData
  //   Object.keys(productDto).forEach(key => {
  //     formData.append(key, productDto[key]);
  //   });
  //
  //   return this.http.post(BASIC_URL + 'api/admin/product', formData);
  // }

  addProduct(productDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/product', productDto);
  }
  getProductById(productId:number): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/product/${productId}`);
  }
  getAllCategories(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/categories');
  }
  // deleteFromWishlist(productId: number): Observable<any> {
  //     return this.http.delete(BASIC_URL + `api/customer/wishlist/product/${productId}`);
  // }

  deleteFromWishlist(userId: number, productId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/customer/wishlist/${userId}/product/${productId}`);
  }

  // getWishlist(): Observable<any> {
  //   return this.http.get(BASIC_URL + 'api/customer/wishlist').pipe(
  //     catchError(error => {
  //       console.error('Error fetching wishlist', error);
  //       return throwError(error); // ou un Observable vide
  //     })
  //   );
  // }

  getWishlist(userId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/customer/wishlist/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching wishlist', error);
        return throwError(error); // ou un Observable vide
      })
    );
  }

  // Méthode pour télécharger le PDF d'un produit par ID
  downloadProductPdf(productId: number): Observable<Blob> {
    return this.http.get(`${BASIC_URL}api/admin/product/${productId}/pdf`, {
      responseType: 'blob'  // Utilisez 'blob' pour télécharger des fichiers binaires comme un PDF
    });
  }
  addProductToCart(addProductInCartDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/customer/cart', addProductInCartDto);
  }
  // addToCart(addProductInCartDto: any): Observable<any> {
  //   return this.http.post(BASIC_URL + 'api/customer/add', addProductInCartDto, { responseType: 'text' });
  // }

  addToCart(userId: number, cartDto: { productId: number }): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/add/${userId}`, cartDto);
  }



  addCategory(categoryDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/category', categoryDto);
  }


}
