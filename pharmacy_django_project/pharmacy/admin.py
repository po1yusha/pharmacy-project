from django.contrib import admin

from .models import *


class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        'customer_first_name', 'customer_last_name', 'customer_email', 'customer_phone', 'bonus_card_number')
    search_fields = ('customer_first_name', 'customer_last_name', 'customer_email')


admin.site.register(Customer, CustomerAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('id', 'name')


admin.site.register(Category, CategoryAdmin)


class MedicineAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'testimony', 'composition', 'price', 'manufacturer', 'country_of_origin', 'availability',
        'method_of_use',
        'interaction_with_food', 'category', 'rating')
    search_fields = (
        'name', 'testimony', 'composition', 'price', 'manufacturer', 'country_of_origin', 'availability',
        'method_of_use',
        'interaction_with_food', 'category', 'rating')
    list_editable = ('availability', 'rating')
    list_filter = ('manufacturer', 'country_of_origin', 'availability', 'method_of_use', 'category', 'rating')


admin.site.register(Medicine, MedicineAdmin)


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'status', 'total_cost', 'order_date', 'customer', 'delivery_address', 'city', 'delivery_method',
        'payment_method')
    search_fields = ('status', 'total_cost', 'order_date', 'customer', 'delivery_address', 'city', 'delivery_method',
                     'payment_method')

    list_filter = ('status', 'order_date', 'city', 'customer')


admin.site.register(Order, OrderAdmin)


class OrderDetailsAdmin(admin.ModelAdmin):
    list_display = ('order', 'medicine', 'count')
    search_fields = ('order', 'medicine', 'count')


admin.site.register(OrderDetails, OrderDetailsAdmin)

admin.site.register(City)