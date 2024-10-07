from django.urls import path, include, re_path
from .views import *

urlpatterns = [
    path('index/', index, name='index'),
    path('index/<str:name>/', index),
    path('index/myorders', show_orders, name='my_orders'),
    path('index/myordersdetails', show_orders_details, name='my_orders_details'),
    path('index/catalog/medicines', catalog_medicine, name='catalog_medicine'),
    path('index/orderpage', make_order, name='order_page'),
    path('login/', LoginUser.as_view(), name='login'),
    path('logout/', logout_user, name='logout'),
]
