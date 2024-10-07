from django.db import models
from django.contrib.auth.models import AbstractUser, User


class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer')
    customer_first_name = models.CharField(max_length=100)
    customer_last_name = models.CharField(max_length=100)
    customer_email = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=20)
    bonus_card_number = models.CharField(max_length=20)

    def __str__(self):
        return self.customer_first_name

    class Meta:
        ordering = ['customer_first_name']


class Category(models.Model):
    CATEGORY = (('medicines', 'Медикаменти'),
                ('vitamin', 'БАД і вітаміни'),
                ('medgoods', 'Медичний товар'),
                ('antibiotic', 'Антибіотики'),
                ('cosmetic', 'Товари для косметологів'),
                ('goodsformom', 'Товари для мам і дітей'),
                )
    name = models.CharField(max_length=255, choices=CATEGORY)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']


class Medicine(models.Model):
    name = models.CharField(max_length=255)
    testimony = models.TextField()
    composition = models.TextField()
    price = models.price = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturer = models.TextField()
    country_of_origin = models.TextField()
    availability = models.BooleanField(default=True)
    method_of_use = models.TextField()
    interaction_with_food = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comments = models.IntegerField(default=0)
    photo = models.ImageField(upload_to="photos/%Y/%m/%d/")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class City(models.Model):
    CITY = (('dp', 'Дніпро'),
            ('zp', 'Запоріжжя'),
            ('kv', 'Київ'),
            ('lv', 'Львів'),
            ('od', 'Одеса'),
            ('kh', 'Харків'),
            )

    name = models.CharField(max_length=255, choices=CITY)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS = (('new', 'Нове'),
              ('processing', 'В обробці'),
              ('ready for shipment', 'Готово до відправлення'),
              ('delivered', 'Доставлено'),
              ('cancelled', 'Відмінено'),
              ('returned', 'Повернено'),
              )

    DELIVERY_METHOD = (('courier', ''' Кур'єром від аптеки "Бажаємо здоров'я" '''),
                       ('self', 'Самовивіз з аптеки'),
                       ('np', 'Нова пошта Відділення'),
                       ('up', 'Укрпошта Відділення'),
                       )

    PAYMENT_METHOD = (('cash', 'Оплата карткою'),
                      ('card', 'Оплата готівкою'),
                      )

    status = models.CharField(max_length=255, choices=STATUS)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    order_date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    delivery_date = models.DateField()
    delivery_method = models.CharField(max_length=255, choices=DELIVERY_METHOD)
    delivery_address = models.CharField(max_length=255)
    payment_method = models.CharField(max_length=255, choices=PAYMENT_METHOD)
    city = models.ForeignKey(City, on_delete=models.CASCADE)

    class Meta:
        ordering = ['order_date']

    def __str__(self):
        return str(self.order_date)


class OrderDetails(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    count = models.IntegerField()
