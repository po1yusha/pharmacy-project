import datetime

from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.views import LoginView
from django.http import HttpResponseNotFound
from django.shortcuts import render, redirect
from django.conf import settings
from django.urls import reverse_lazy
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from pharmacy.forms import LoginUserForm
from pharmacy.models import *
import json
import pdb


def index(request, name='користувач'):
    print("Index")
    tit = f"Вітаємо, {name}!"
    main_image = settings.STATIC_URL + 'img/main-image_doctor.png'
    button_name = "Зареєструватись"
    enter_tit = "Увійти"
    context = {
        'main_image': main_image,
        'tit': tit,
        'button_name': button_name,
        'enter_tit': enter_tit
    }

    main_image_2 = settings.STATIC_URL + 'img/main-greating.png'
    button_name_2 = "За покупками!"
    enter_tit_2 = "Вийти"
    context_2 = {
        'main_image': main_image_2,
        'tit': tit,
        'button_name': button_name_2,
        'enter_tit': enter_tit_2
    }

    if name != 'користувач':
        return render(request, 'index.html', context_2)
    return render(request, 'index.html', context)


def catalog_medicine(request):
    if request.GET:

        print(request.GET)

        all_products = [
            {'product_img': settings.STATIC_URL + 'img/prep/alzmerat.png', 'price': '463.4 ₴', 'comment': '1 відгук',
             'name': "Альцмерат розчин для ін'єкцій 250 мг", 'rating': '4', 'range_rating': range(4),
             'range_gray': range(1)},
            {'product_img': settings.STATIC_URL + 'img/prep/corvalkaps.webp', 'price': '56.3 ₴',
             'comment': '0 відгуків', 'name': "Корвалкапс капсули №27", 'rating': '0', 'range_rating': range(0),
             'range_gray': range(5)},
            {'product_img': settings.STATIC_URL + 'img/prep/corvalol.png', 'price': '40.7 ₴', 'comment': '0 відгуків',
             'name': "Корвалол-Дарниця краплі 40 мл", 'rating': '0', 'range_rating': range(0), 'range_gray': range(5)},
            {'product_img': settings.STATIC_URL + 'img/prep/denigma.webp', 'price': '2 261.4 ₴', 'comment': '2 відгуки',
             'name': "Денігма 10 мг таблетки №140", 'rating': '2', 'range_rating': range(2), 'range_gray': range(3)},
            {'product_img': settings.STATIC_URL + 'img/prep/relaxil.webp', 'price': '136.3 ₴', 'comment': '1 відгук',
             'name': "Релаксил капсули №20", 'rating': '5', 'range_rating': range(5), 'range_gray': range(0)},
            {'product_img': settings.STATIC_URL + 'img/prep/somazina.png', 'price': '983.6 ₴', 'comment': '1 відгук',
             'name': "Сомазина 1000 мг ампули 4 мл №10", 'rating': '2', 'range_rating': range(2),
             'range_gray': range(3)},
        ]

        filtered_products = all_products


        query = request.GET.get('search_expression')
        if query:
            filtered_products = [product for product in filtered_products if query.lower() in product['name'].lower()]
            data = []
            for product in filtered_products:
                data.append({
                    'product_img': product['product_img'],
                    'price': product['price'],
                    'comment': product['comment'],
                    'name': product['name'],
                    'rating': product['rating'],
                    'range_rating': list(product['range_rating']),
                    'range_gray': list(product['range_gray'])
                })
            return JsonResponse(data, safe=False)

        rating = request.GET.get('rating')
        if rating:
            filtered_products = [product for product in filtered_products if product['rating'] == rating]

            context = {
                'products': filtered_products}
            return render(request, 'catalog_of_goods_1.html', context)

    print("Medicine")
    all_products = [
        {'product_img': settings.STATIC_URL + 'img/prep/alzmerat.png', 'price': '463.4 ₴', 'comment': '1 відгук',
         'name': "Альцмерат розчин для ін'єкцій 250 мг", 'rating': 4, 'range_rating': range(4), 'range_gray': range(1)},
        {'product_img': settings.STATIC_URL + 'img/prep/corvalkaps.webp', 'price': '56.3 ₴', 'comment': '0 відгуків',
         'name': "Корвалкапс капсули №27", 'rating': 0, 'range_rating': range(0), 'range_gray': range(5)},
        {'product_img': settings.STATIC_URL + 'img/prep/corvalol.png', 'price': '40.7 ₴', 'comment': '0 відгуків',
         'name': "Корвалол-Дарниця краплі 40 мл", 'rating': 0, 'range_rating': range(0), 'range_gray': range(5)},
        {'product_img': settings.STATIC_URL + 'img/prep/denigma.webp', 'price': '2 261.4 ₴', 'comment': '2 відгуки',
         'name': "Денігма 10 мг таблетки №140", 'rating': 2, 'range_rating': range(2), 'range_gray': range(3)},
        {'product_img': settings.STATIC_URL + 'img/prep/relaxil.webp', 'price': '136.3 ₴', 'comment': '1 відгук',
         'name': "Релаксил капсули №20", 'rating': 5, 'range_rating': range(5), 'range_gray': range(0)},
        {'product_img': settings.STATIC_URL + 'img/prep/somazina.png', 'price': '983.6 ₴', 'comment': '1 відгук',
         'name': "Сомазина 1000 мг ампули 4 мл №10", 'rating': 2, 'range_rating': range(2), 'range_gray': range(3)},
    ]
    context = {
        'products': all_products}
    return render(request, 'catalog_of_goods_1.html', context)


@csrf_exempt
def make_order(request):
    print("Order")
    if request.method == 'GET':
        print("Get")
        return render(request, 'order_page.html')
    if request.method == 'POST':
        print("Post")

        city = City.objects.get(name=request.POST.get('format')).id

        customer = Customer.objects.get(user_id=request.user.id)

        total_cost = float(request.POST.get('total_cost'))

        date_now = datetime.datetime.now()

        delivery_date = date_now + datetime.timedelta(days=2)

        delivery_method = request.POST.get('method')

        delivery_choice = ""

        if delivery_method == "courier":
            delivery_method = 'courier'
            delivery_choice = 'address'
        elif delivery_method == "pharmacy":
            delivery_method = 'self'
            delivery_choice = 'pharmacyAddress'
        elif delivery_method == "NPDep":
            delivery_method = 'np'
            delivery_choice = 'NPDep'
        elif delivery_method == "UKDep":
            delivery_method = 'up'
            delivery_choice = 'UKDep'

        delivery_address = request.POST.get(delivery_choice)
        payment_method = request.POST.get('payment_method')

        order = Order(
            status='new',
            total_cost=total_cost,
            order_date=date_now,
            delivery_date=delivery_date,
            delivery_address=delivery_address,
            delivery_method=delivery_method,
            payment_method=payment_method,
            city_id=city,
            customer=customer
        )

        order.save()

        orderJson = request.POST.get('productJson')
        products = json.loads(orderJson)

        for product in products:
            order_details = OrderDetails(
                count=product.get('quantity'),
                medicine_id=Medicine.objects.get(name=product.get('title')).id,
                order_id=order.id
            )
            order_details.save()

        return render(request, 'success.html')

def user_auto(request):
    print("Auto")
    return render(request, 'registration/login.html')


@login_required(login_url='/accounts/login/')
def show_orders(request):
    allOrders = Order.objects.all()
    orders = []
    for order in allOrders:
        if order.customer_id == Customer.objects.get(user_id=request.user.id).id:
            orders.append(order)

    context = {
        'orders': orders}
    return render(request, 'my_orders.html', context)


def show_orders_details(request):
    order = int(request.GET.get("order_id"))
    all_order_details = OrderDetails.objects.all()

    order_details = []

    for order_detail in all_order_details:
        if order_detail.order_id == order:
            order_details.append(order_detail)

    products = []
    for order_detail in order_details:
        product = Medicine.objects.get(id=order_detail.medicine_id)
        products.append({'product': product, 'count': order_detail.count})

    context = {"products": products}
    return render(request, 'my_orders_details.html', context)


class LoginUserOrder(LoginView):
    form_class = LoginUserForm
    template_name = 'registration/login.html'

    def get_success_url(self):
        return reverse_lazy('my_orders')


class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'registration/login.html'

    def get_success_url(self):
        return reverse_lazy('index')


def logout_user(request):
    logout(request)
    return redirect('index')
