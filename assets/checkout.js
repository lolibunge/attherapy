'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CheckoutHelper = /*#__PURE__*/function () {
  function CheckoutHelper() {
    _classCallCheck(this, CheckoutHelper);

    this.step = window.Shopify.Checkout.step;
    this.steps = {
      'contact_information': 'one',
      'shipping_method': 'two',
      'payment_method': 'three',
      'order_status': 'four'
    };
    this.helper = false; // Execute

    this.run();
  }

  _createClass(CheckoutHelper, [{
    key: "run",
    value: function run() {
      if (!this.steps[this.step]) return;
      this[this.steps[this.step]]();
    } // contact_information

  }, {
    key: "one",
    value: function one() {
      var _this = this;

      // Updated UI
      var interval = setInterval(function () {
        var title_dom = document.querySelector('#section-delivery-title');
        if (!title_dom) return;
        clearInterval(interval); // Update UI

        var target = document.querySelector('.section--shipping-address .section__content'),
            fieldset_dom = target.querySelector('.fieldset'),
            inject_dom = document.createElement('div'),
            subtitle = document.createElement('p'),
            addr_selector = document.querySelector('select#checkout_shipping_address_id'),
            addr_field = document.querySelector('.address-fields > .field.field--required'),
            doms = document.querySelectorAll('input#checkout_shipping_address_company'),
            company_cb = function company_cb(dom) {
          dom.value === '' ? dom.removeAttribute('readonly') : dom.setAttribute('readonly', true);
        }; // Inject HTML


        inject_dom.classList.add('content-box');
        inject_dom.insertAdjacentHTML('afterbegin', "<ul class=\"tabs_list\" role=\"tablist\">\n\t\t\t\t\t<li class=\"tabs_item active\" data-address-type='1'>\n\t\t\t\t\t\t<span class=\"tabs_button\">\n\t\t\t\t\t\t\t<span>Saved Address</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class=\"tabs_item\" data-address-type=\"2\">\n\t\t\t\t\t\t<span class=\"tabs_span\">\n\t\t\t\t\t\t\t<span>Drop Ship</span>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"content-box__panel\" role=\"tabpanel\" data-tab=\"default\"></div>\n\t\t\t\t");
        inject_dom.querySelector('.content-box__panel').appendChild(fieldset_dom);
        target.appendChild(inject_dom);

        if (_this.helper == false) {
          _this.helper = window.AddressSelector.prototype;
          _this.helper.$ = window.Checkout.$;

          _this.helper.init.bind(_this.helper)();
        } // Bind Tab Event


        inject_dom.querySelectorAll('.tabs_item').forEach(function (e) {
          e.addEventListener('click', function () {
            if (e.classList.contains('active')) return;
            var mode = e.dataset.addressType,
                opposite;

            if (mode == '2') {
              // New Address
              opposite = e.parentNode.querySelector('li:first-child');
              addr_selector.selectedIndex = addr_selector.length - 1;

              _this.helper.clearAddressFields();

              addr_field.classList.add('hidden');
              doms.forEach(function (dom) {
                return dom.removeAttribute('readonly');
              });
            } else {
              // Save Address
              opposite = e.parentNode.querySelector('li:last-child');
              addr_selector.selectedIndex = 0;

              _this.helper.updateAddressFields(_this.helper.getSelectedAddress());

              addr_field.classList.remove('hidden');
              doms.forEach(company_cb);
            }

            opposite.classList.remove('active');
            e.classList.add('active');
          });
        }); // Bind Selector Event

        addr_selector.addEventListener('change', function () {
          return _this.helper.getSelectedAddress()['company'] === null ? doms.forEach(function (dom) {
            return dom.removeAttribute('readonly');
          }) : doms.forEach(function (dom) {
            return dom.setAttribute('readonly', true);
          });
        }); // Hide Address Option

        addr_selector.querySelector('option[value=""]').classList.add('hidden'); // Company Name Readonly

        doms.forEach(company_cb); // Updated Title

        subtitle.innerText = 'Ship to saved address or drop ship to a customer by adding a new address below';
        title_dom.parentNode.insertBefore(subtitle, title_dom.nextSibling);
      }, 200);
    } // shipping_method

  }, {
    key: "two",
    value: function two() {} // payment_method

  }, {
    key: "three",
    value: function three() {
      var _this2 = this;

      var section, check, addr_selector, x, properties, address, billing_addr, pay_by_cash, helper_billing;
      check = setInterval(function () {
        section = document.querySelector('.section.section--billing-address');
        if (!section) return;
        clearInterval(check);
        pay_by_cash = document.querySelector('[data-gateway-group="manual"]');
        addr_selector = section.querySelector('#checkout_billing_address_id');
        address = window.shippingAddress || {
          first_name: 'empty',
          last_name: 'empty'
        }; // Update Title

        section.querySelector('.section__title').innerText = 'Billing Account'; // Update Description

        section.querySelector('.section__text').innerText = "This order will be placed under ".concat(window.customerCompany);

        if (pay_by_cash) {
          if (!window.paymetnTerm || window.paymetnTerm.includes('Pre-Payment')) {
            pay_by_cash.classList.add('hidden');
          } else {
            pay_by_cash.querySelector('.radio__label label').innerText = "On Account (".concat(window.paymetnTerm, ")");
          }
        } // Init AddressSelector


        if (_this2.helper === false) {
          _this2.helper = window.AddressSelector.prototype;
          _this2.helper.$ = window.Checkout.$;

          _this2.helper.init.bind(_this2.helper)();
        }

        if (section.querySelector('#checkout_different_billing_address_true')) {
          var valid_address = address.company === window.customerCompany;

          if (!valid_address) {
            // Shipping
            section.querySelector('#checkout_different_billing_address_true').checked = true;

            _this2.helper.clearAddressFields();

            section.querySelector('#checkout_billing_address_first_name').value = 'Drop Ship';
            section.querySelector('#checkout_billing_address_last_name').value = address.last_name;
            section.querySelector('#checkout_billing_address_address1').value = address.address1;
            section.querySelector('#checkout_billing_address_address2').value = address.address2;
            section.querySelector('#checkout_billing_address_company').value = window.customerCompany;
            section.querySelector('#checkout_billing_address_city').value = address.city;
            section.querySelector('#checkout_billing_address_country').value = address.country;
            section.querySelector('#checkout_billing_address_zip').value = address.zip; // Region

            if (address.province_code) section.querySelector('#checkout_billing_address_province').value = address.province_code;
          } else {
            section.querySelector('#checkout_different_billing_address_false').checked = true;
          } // Hide All Stuff


          section.querySelector('.content-box').classList.add('hidden');
        } else {
          // Local Pick up
          var company_field = section.querySelector('#checkout_billing_address_company'); // Set Company

          company_field.value = window.customerCompany;
          company_field.setAttribute('readonly', true);
          var observe = new MutationObserver(function () {
            if (company_field.value != window.customerCompany) {
              company_field.value = window.customerCompany;
            }
          });
          observe.observe(company_field, {
            childList: !0,
            attributes: !0,
            characterData: !0,
            subtree: !0,
            attributeOldValue: !0,
            characterDataOldValue: !0
          });
        }
      }, 200);
    } // order_status

  }, {
    key: "four",
    value: function four() {}
  }]);

  return CheckoutHelper;
}();

var PSHelper = new CheckoutHelper();